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
    const { knowledgeItemId, content } = body;

    if (!knowledgeItemId && !content) {
      return NextResponse.json(
        { error: "knowledgeItemId or content is required" },
        { status: 400 }
      );
    }

    let textToSummarize = content;

    if (knowledgeItemId) {
      const item = await prisma.knowledgeItem.findUnique({
        where: { id: knowledgeItemId },
      });

      if (!item) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }

      if (item.userId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      textToSummarize = item.content;
    }

    const ai = await getAI();
    const summary = await ai.summarize(textToSummarize);

    if (knowledgeItemId) {
      await prisma.knowledgeItem.update({
        where: { id: knowledgeItemId },
        data: { summary },
      });
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error summarizing:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
