import * as pdfjsLib from 'pdfjs-dist';

// Use the bundled worker from pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export async function extractTextFromFile(file: File): Promise<string> {
  if (file.name.endsWith('.txt')) {
    return file.text();
  }

  if (file.name.endsWith('.pdf')) {
    return extractTextFromPdf(file);
  }

  throw new Error('Unsupported file type. Please upload a PDF or TXT file.');
}

async function extractTextFromPdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ('str' in item ? (item as Record<string, unknown>).str as string : ''))
      .join(' ');
    pages.push(text);
  }

  return pages.join('\n\n');
}
