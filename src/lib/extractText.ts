// Client-side text extraction for uploaded files.
// PDF via pdfjs-dist, DOCX via mammoth (browser bundle), TXT/MD pass-through.

import * as pdfjsLib from "pdfjs-dist";
// Vite-friendly worker URL (?url returns a string).
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
import mammoth from "mammoth/mammoth.browser";

(pdfjsLib as unknown as { GlobalWorkerOptions: { workerSrc: string } }).GlobalWorkerOptions.workerSrc =
  pdfWorkerUrl as string;

export const MAX_DOC_CHARS = 200_000; // soft per-document cap

export type ExtractResult =
  | { ok: true; text: string; truncated: boolean }
  | { ok: false; reason: string };

export async function extractFileText(file: File): Promise<ExtractResult> {
  const name = file.name.toLowerCase();
  try {
    if (name.endsWith(".txt") || name.endsWith(".md") || file.type.startsWith("text/")) {
      const text = await file.text();
      return capped(text);
    }
    if (name.endsWith(".pdf") || file.type === "application/pdf") {
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      let out = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((it: unknown) => (typeof it === "object" && it && "str" in it ? (it as { str: string }).str : ""))
          .join(" ");
        out += pageText + "\n\n";
        if (out.length > MAX_DOC_CHARS * 1.2) break;
      }
      return capped(out.trim());
    }
    if (name.endsWith(".docx")) {
      const buf = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: buf });
      return capped(result.value);
    }
    return { ok: false, reason: "Unsupported file type. Use PDF, DOCX, TXT, or MD." };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : "Could not read this file." };
  }
}

function capped(text: string): ExtractResult {
  const cleaned = text.replace(/\u0000/g, "").trim();
  if (cleaned.length === 0) return { ok: false, reason: "No readable text found." };
  if (cleaned.length > MAX_DOC_CHARS) {
    return { ok: true, text: cleaned.slice(0, MAX_DOC_CHARS), truncated: true };
  }
  return { ok: true, text: cleaned, truncated: false };
}
