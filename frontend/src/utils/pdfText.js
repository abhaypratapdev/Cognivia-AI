import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";
import pdfWorkerUrl from "../pdf-worker";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

function normalizeText(text) {
  return (text || "").replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

export async function extractPdfTextFromUrl(fileUrl) {
  const proxyUrl = `${API_BASE}/files/proxy-pdf?url=${encodeURIComponent(fileUrl)}`;
  const loadingTask = getDocument(proxyUrl);
  const pdf = await loadingTask.promise;
  const pageTexts = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => item.str || "")
      .join(" ")
      .trim();

    if (pageText) {
      pageTexts.push(pageText);
    }
  }

  return normalizeText(pageTexts.join("\n\n"));
}
