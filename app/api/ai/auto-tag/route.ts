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

    let textToTag = content;

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

      textToTag = item.content;
    }

    const existingTags = await prisma.tag.findMany({ select: { name: true } });
    const ai = await getAI();
    const tags = await ai.autoTag(textToTag, existingTags.map((t: { name: string }) => t.name));

    if (knowledgeItemId) {
      const updated = await prisma.knowledgeItem.update({
        where: { id: knowledgeItemId },
        data: {
          tags: {
            connectOrCreate: tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        },
        include: { tags: true },
      });
      return NextResponse.json({ tags: updated.tags });
    }

    return NextResponse.json({ tags: tags.map((name) => ({ id: name, name })) });
  } catch (error) {
    console.error("Error auto-tagging:", error);
    return NextResponse.json(
      { error: "Failed to generate tags" },
      { status: 500 }
    );
  }
}
