import { NextResponse } from 'next/server';
import PDFParser from 'pdf2json';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/config/database';
import Analysis from '@/models/Analysis';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: Parse PDF
const parsePDF = async (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(this, 1);
    pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", (pdfData) => resolve(pdfParser.getRawTextContent()));
    pdfParser.parseBuffer(buffer);
  });
};

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.formData();
    const file = data.get('file'); 
    const jdFile = data.get('jdFile');      // Option A: File
    const jdTextRaw = data.get('jdText');   // Option B: Text (From Dropdown)

    if (!file) return NextResponse.json({ error: "No resume received" }, { status: 400 });

    // 1. Extract Resume Text
    const resumeBuffer = Buffer.from(await file.arrayBuffer());
    const resumeText = await parsePDF(resumeBuffer);

    // 2. Determine Job Description Text
    let finalJdText = "";

    // Priority 1: User uploaded a JD PDF
    if (jdFile && jdFile.size > 0) {
      const jdBuffer = Buffer.from(await jdFile.arrayBuffer());
      finalJdText = await parsePDF(jdBuffer);
    } 
    // Priority 2: User selected a company from Dropdown
    else if (jdTextRaw) {
      finalJdText = jdTextRaw;
    }

    // 3. AI Logic
    let prompt;
    if (finalJdText.trim().length > 50) {
      // MATCH MODE
      prompt = `
        You are an expert ATS. Compare this Resume against the Target Job/Company Profile.
        
        Resume: "${resumeText.substring(0, 10000)}"
        Target Profile: "${finalJdText.substring(0, 5000)}"
        
        Analyze strict alignment.
        - Score: 0-100 based on fit.
        - Strengths: Skills present.
        - Weaknesses: Critical missing skills.
        - Improvements: Actionable advice.

        Return STRICT JSON:
        {
          "score": (integer),
          "summary": (string, "Match analysis: ..."),
          "strengths": (array),
          "weaknesses": (array),
          "improvements": (array)
        }
      `;
    } else {
      // GENERAL MODE
      prompt = `
        You are an expert HR Manager. Analyze this resume strictly.
        Resume: "${resumeText.substring(0, 10000)}" 
        
        Return STRICT JSON:
        {
          "score": (integer 0-100),
          "summary": (string),
          "strengths": (array),
          "weaknesses": (array),
          "improvements": (array)
        }
      `;
    }

    // 4. Call AI
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text().replace(/```json|```/g, "").trim();
    const analysisData = JSON.parse(jsonString);

    // 5. Save to DB
    await connectDB();
    await Analysis.create({
      userId: session.user.id,
      fileName: file.name,
      jobDescription: finalJdText, 
      score: analysisData.score,
      summary: analysisData.summary,
      strengths: analysisData.strengths,
      weaknesses: analysisData.weaknesses,
      improvements: analysisData.improvements,
    });

    return NextResponse.json({ data: analysisData }, { status: 200 });

  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: "Failed to analyze" }, { status: 500 });
  }
}