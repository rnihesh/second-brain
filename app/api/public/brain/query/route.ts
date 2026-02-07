import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAI } from "@/lib/ai/provider";

export async function GET(req: NextRequest) {
  try {
    const question = req.nextUrl.searchParams.get("q");

    if (!question) {
      return NextResponse.json(
        { error: "q query parameter is required" },
        { status: 400 }
      );
    }

    type KnowledgeSnippet = { id: string; title: string; content: string };

    const items: KnowledgeSnippet[] = await prisma.knowledgeItem.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { id: true, title: true, content: true },
    });

    const context = items
      .map((item) => `## ${item.title}\n${item.content}`)
      .join("\n\n---\n\n");

    const ai = await getAI();
    const answer = await ai.query(question, context);

    const sources = items.slice(0, 5).map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: item.content.substring(0, 200),
    }));

    return NextResponse.json({
      answer,
      sources,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error processing public query:", error);
    return NextResponse.json(
      { error: "Failed to process query" },
      { status: 500 }
    );
  }
}
