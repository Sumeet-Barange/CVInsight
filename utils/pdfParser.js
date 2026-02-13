// We don't import at the top to avoid "Server" crashes.

export const extractTextFromPDF = async (file) => {
  // 1. Dynamically import the library
  // We import the main entry point which is safer than 'build/pdf'
  const pdfjsLib = await import('pdfjs-dist');

  // 2. Set the worker source
  // We use the CDN to ensure the worker version matches the library version exactly
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  // 3. Read the file (Modern way)
  const arrayBuffer = await file.arrayBuffer();

  // 4. Load the PDF
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  
  try {
    const pdf = await loadingTask.promise;
    let fullText = '';

    // 5. Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    throw new Error("Could not parse PDF text.");
  }
};