import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAI } from "@/lib/ai/provider";

const TEXT_EXTENSIONS = [".txt", ".md", ".markdown", ".csv", ".json", ".xml", ".html", ".htm"];

function isTextFile(filename: string): boolean {
  return TEXT_EXTENSIONS.some((ext) => filename.toLowerCase().endsWith(ext));
}

function isImageFile(filename: string): boolean {
  return /\.(png|jpg|jpeg|gif|webp|bmp|tiff?)$/i.test(filename);
}

function isPdfFile(filename: string): boolean {
  return filename.toLowerCase().endsWith(".pdf");
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const filename = file.name;

    // Text files: read directly
    if (isTextFile(filename)) {
      const text = await file.text();
      return NextResponse.json({ content: text, filename, method: "direct" });
    }

    // Images: use AI vision (OpenAI -> Gemini -> Ollama)
    if (isImageFile(filename)) {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");

      try {
        const ai = await getAI();
        const content = await ai.extractFromImage(
          base64,
          "Extract ALL text content from this image. If it contains handwritten notes, diagrams, code, or screenshots, describe everything you see in detail. Return the extracted text preserving structure. If there's no text, describe the visual content thoroughly."
        );

        return NextResponse.json({
          content: content || "Could not extract content from image.",
          filename,
          method: "vision",
        });
      } catch {
        return NextResponse.json(
          { error: "Vision extraction failed. Check your AI provider configuration." },
          { status: 502 }
        );
      }
    }

    // PDFs: use pdf-parse for text extraction
    if (isPdfFile(filename)) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      try {
        // Dynamic import of pdf-parse
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require("pdf-parse");
        const pdfData = await pdfParse(buffer);
        const extractedText = pdfData.text?.trim();

        if (extractedText && extractedText.length > 20) {
          return NextResponse.json({
            content: extractedText,
            filename,
            method: "pdf-parse",
          });
        }
      } catch (e) {
        console.warn("pdf-parse failed, falling back to vision:", e);
      }

      // Fallback: if pdf-parse got nothing (scanned PDF), try vision
      try {
        const base64 = buffer.toString("base64");
        const ai = await getAI();
        const content = await ai.extractFromImage(
          base64,
          "This is a PDF document. Extract and return all readable text content from it. If it contains tables, diagrams, or images, describe them. Preserve the structure and formatting."
        );

        return NextResponse.json({
          content: content || "Could not extract content from PDF.",
          filename,
          method: "pdf-vision",
        });
      } catch {
        return NextResponse.json({
          content: "Could not extract content from this PDF. Try copy-pasting the text manually.",
          filename,
          method: "pdf-fallback",
        });
      }
    }

    return NextResponse.json(
      { error: `Unsupported file type: ${filename}. Supported: text files (.txt, .md), images (.png, .jpg), PDFs (.pdf).` },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error extracting file content:", error);
    return NextResponse.json(
      { error: "Failed to extract file content" },
      { status: 500 }
    );
  }
}
