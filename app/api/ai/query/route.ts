import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { getAI } from "@/lib/ai/provider";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { question } = body;

    if (!question) {
      return NextResponse.json(
        { error: "question is required" },
        { status: 400 }
      );
    }

    type KnowledgeSnippet = {
      id: string;
      title: string;
      content: string;
      sourceUrl: string | null;
      type: string;
      tags: { name: string }[];
    };

    const items: KnowledgeSnippet[] = await prisma.knowledgeItem.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        title: true,
        content: true,
        sourceUrl: true,
        type: true,
        tags: { select: { name: true } },
      },
    });

    const context = items
      .map((item) => {
        let entry = `## ${item.title}\nType: ${item.type}`;
        if (item.sourceUrl) entry += `\nURL: ${item.sourceUrl}`;
        if (item.tags.length > 0) entry += `\nTags: ${item.tags.map((t) => t.name).join(", ")}`;
        entry += `\n\n${item.content}`;
        return entry;
      })
      .join("\n\n---\n\n");

    const ai = await getAI();
    const answer = await ai.query(question, context);

    // Return all items as potential sources — the AI answer will reference the relevant ones
    const sources = items.map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: item.content.substring(0, 200),
    }));

    return NextResponse.json({ answer, sources });
  } catch (error) {
    console.error("Error querying AI:", error);
    return NextResponse.json(
      { error: "Failed to process query" },
      { status: 500 }
    );
  }
}
