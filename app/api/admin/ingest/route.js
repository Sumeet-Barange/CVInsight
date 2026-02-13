import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import connectDB from '@/config/database';
import Company from '@/models/Company';

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get('file');
    const year = data.get('year');

    if (!file || !year) {
      return NextResponse.json({ error: "Missing file or year" }, { status: 400 });
    }

    // 1. Read the CSV File
    const text = await file.text();

    // 2. Parse CSV
    const { data: rows } = Papa.parse(text, { 
      header: true, 
      skipEmptyLines: true 
    });

    console.log(`Found ${rows.length} rows in CSV.`);

    await connectDB();
    let savedCount = 0;

    // 3. Loop and Save
    for (const row of rows) {
      // Clean up the data based on your specific CSV format
      
      // Parse Branches: "B.E (CS/ECE/EEE/ENI)" -> ["CS", "ECE", "EEE", "ENI"]
      let branches = [];
      if (row['Branches']) {
        const rawBranch = row['Branches']
          .replace('B.E', '')
          .replace('(', '')
          .replace(')', '')
          .trim();
        // Split by slash OR comma depending on format
        branches = rawBranch.split(/[\/,]/).map(b => b.trim()).filter(b => b);
      }

      // Parse CGPA: Handle "No CGPA Cutoff" or numbers
      let cgpa = 0;
      if (row['CGPA']) {
        const cleanCgpa = row['CGPA'].toString().toLowerCase();
        if (cleanCgpa.includes('no') || cleanCgpa.includes('nan')) {
          cgpa = 0;
        } else {
          cgpa = parseFloat(cleanCgpa) || 0;
        }
      }

      // Map to DB Schema
      const companyData = {
        name: row['Name']?.trim(),
        roles: row['Roles'] ? [row['Roles'].trim()] : [], // Storing role as array
        eligibleBranches: branches,
        cgpaCutoff: cgpa,
        stipend: row['Stipend'] || "Not Mentioned",
        selectionRounds: row['Rounds'] ? [row['Rounds']] : [], // Storing rounds as array
        studentExperience: row['Experience'] || "",
        year: parseInt(year)
      };

      // Skip empty rows
      if (!companyData.name) continue;

      // Check Duplicates (Same Company + Same Year = Duplicate)
      const exists = await Company.findOne({ 
        name: companyData.name, 
        year: parseInt(year) 
      });

      if (!exists) {
        await Company.create(companyData);
        savedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `CSV Processed. Found ${rows.length} rows. Saved ${savedCount} new companies.`,
      data: rows 
    }, { status: 200 });

  } catch (error) {
    console.error("CSV Error:", error);
    return NextResponse.json({ error: "Failed to process CSV: " + error.message }, { status: 500 });
  }
}