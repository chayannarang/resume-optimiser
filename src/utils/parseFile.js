import mammoth from 'mammoth';

const PDFJS_WORKER_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

/**
 * Extract plain text from a PDF File using the PDF.js CDN global (window.pdfjsLib).
 * Concatenates all pages, preserving line breaks between them.
 */
export async function extractTextFromPDF(file) {
  const pdfjsLib = window.pdfjsLib;
  if (!pdfjsLib) throw new Error('PDF.js failed to load. Please refresh and try again.');

  pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pageTexts = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Join items with a space; items that end a line typically have a \n in str
    const text = content.items.map((item) => item.str).join(' ');
    pageTexts.push(text);
  }

  const fullText = pageTexts.join('\n').trim();

  // Heuristic: a scanned/image PDF has very little extractable text
  if (fullText.length < 50) {
    throw new Error(
      "Scanned resumes aren't supported. Please paste your resume as text instead."
    );
  }

  return fullText;
}

/**
 * Extract plain text from a .docx Word file using mammoth.
 */
export async function extractTextFromWord(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  if (result.value.trim().length === 0) {
    throw new Error("We couldn't read any text from this file. Please paste your resume as text instead.");
  }
  return result.value.trim();
}

/**
 * Dispatch to the correct extractor based on file extension.
 * Throws for unsupported formats.
 */
export async function extractTextFromFile(file) {
  const name = file.name.toLowerCase();

  if (name.endsWith('.pdf')) {
    return extractTextFromPDF(file);
  }

  if (name.endsWith('.docx') || name.endsWith('.doc')) {
    return extractTextFromWord(file);
  }

  throw new Error('Only PDF and Word (.docx) files are supported.');
}
