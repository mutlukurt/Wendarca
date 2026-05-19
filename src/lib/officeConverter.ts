import * as XLSX from "xlsx";
import JSZip from "jszip";
import { getPresentationEngine } from "@/lib/pptxConverter";
import { getFileExtension, replaceExtension } from "@/lib/fileUtils";

export async function convertWordToExcel(file: File): Promise<Blob> {
  const rows = await extractWordRows(file);
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(rows.length > 0 ? rows : [["Content"], [""]]);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Document");
  const output = XLSX.write(workbook, { bookType: "xlsx", type: "array" }) as ArrayBuffer;

  return new Blob([output], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

async function extractWordRows(file: File): Promise<string[][]> {
  try {
    const html = await convertOfficeFileToHtml(file, "docx");
    const document = new DOMParser().parseFromString(html, "text/html");
    const rows = extractRowsFromWordHtml(document);
    if (rows.length > 0) return rows;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("LibreOffice DOCX to HTML fallback activated.", error);
    }
  }

  return extractRowsFromDocxXml(file);
}

export async function convertExcelToWord(file: File): Promise<Blob> {
  const converter = await getPresentationEngine();
  const inputFormat = getFileExtension(file.name) === "xls" ? "xls" : "xlsx";
  const htmlResult = await converter.convert(
    await file.arrayBuffer(),
    { inputFormat, outputFormat: "html" },
    file.name,
  );
  const docxResult = await converter.convert(
    toExactArrayBuffer(htmlResult.data),
    { inputFormat: "html", outputFormat: "docx" },
    replaceExtension(file.name, "html"),
  );

  return new Blob([toExactArrayBuffer(docxResult.data)], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

export async function convertWordToPdf(file: File, quality: number, onProgress?: (progress: number) => void): Promise<Blob> {
  return convertOfficeToPdf(file, "docx", quality, onProgress);
}

export async function convertExcelToPdf(file: File, quality: number, onProgress?: (progress: number) => void): Promise<Blob> {
  const inputFormat = getFileExtension(file.name) === "xls" ? "xls" : "xlsx";
  return convertOfficeToPdf(file, inputFormat, quality, onProgress);
}

async function convertOfficeToPdf(
  file: File,
  inputFormat: "docx" | "xlsx" | "xls",
  quality: number,
  onProgress?: (progress: number) => void,
): Promise<Blob> {
  const converter = await getPresentationEngine((progress) => onProgress?.(progress));
  onProgress?.(40);
  const result = await converter.convert(
    await file.arrayBuffer(),
    {
      inputFormat,
      outputFormat: "pdf",
      pdf: { quality: Math.round(quality * 100) },
    },
    file.name,
  );

  onProgress?.(100);
  return new Blob([toExactArrayBuffer(result.data)], { type: "application/pdf" });
}

async function convertOfficeFileToHtml(file: File, inputFormat: "docx" | "xlsx" | "xls"): Promise<string> {
  const converter = await getPresentationEngine();
  const result = await converter.convert(
    await file.arrayBuffer(),
    { inputFormat, outputFormat: "html" },
    file.name,
  );
  const html = new TextDecoder().decode(result.data);

  if (!html.trim()) {
    throw new Error("LibreOffice did not return readable HTML for this document.");
  }

  return html;
}

function extractRowsFromWordHtml(document: globalThis.Document): string[][] {
  const tableRows = Array.from(document.querySelectorAll("table tr")).map((row) =>
    Array.from(row.querySelectorAll("th,td")).map((cell) => normalizeText(cell.textContent ?? "")),
  );

  if (tableRows.length > 0) {
    return tableRows.filter((row) => row.some(Boolean));
  }

  return Array.from(document.body.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li"))
    .map((node) => [normalizeText(node.textContent ?? "")])
    .filter((row) => row[0].length > 0);
}

async function extractRowsFromDocxXml(file: File): Promise<string[][]> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const documentXml = await zip.file("word/document.xml")?.async("string");

  if (!documentXml) {
    throw new Error("DOCX document body could not be read.");
  }

  const document = new DOMParser().parseFromString(documentXml, "application/xml");
  const tables = elementsByLocalName(document, "tbl");
  const tableRows = tables.flatMap((table) =>
    directChildrenByLocalName(table, "tr").map((row) =>
      directChildrenByLocalName(row, "tc").map((cell) =>
        elementsByLocalName(cell, "t")
          .map((node) => normalizeText(node.textContent ?? ""))
          .filter(Boolean)
          .join(" "),
      ),
    ),
  );

  if (tableRows.length > 0) {
    return tableRows.filter((row) => row.some(Boolean));
  }

  return elementsByLocalName(document, "p")
    .map((paragraph) => [
      elementsByLocalName(paragraph, "t")
        .map((node) => normalizeText(node.textContent ?? ""))
        .filter(Boolean)
        .join(" "),
    ])
    .filter((row) => row[0].length > 0);
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function toExactArrayBuffer(data: Uint8Array): ArrayBuffer {
  return new Uint8Array(data).buffer;
}

function elementsByLocalName(root: ParentNode, localName: string): Element[] {
  return Array.from(root.querySelectorAll("*")).filter((element) => element.localName === localName);
}

function directChildrenByLocalName(root: Element, localName: string): Element[] {
  return Array.from(root.children).filter((element) => element.localName === localName);
}
