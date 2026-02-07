import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { getAI } from "@/lib/ai/provider";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type");
    const tags = searchParams.get("tags");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const where: Record<string, unknown> = { userId: session.user.id };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim());
      where.tags = { some: { name: { in: tagList } } };
    }

    const validSortFields = ["createdAt", "updatedAt", "title"];
    const sortField = validSortFields.includes(sort) ? sort : "createdAt";

    const [items, total] = await Promise.all([
      prisma.knowledgeItem.findMany({
        where,
        include: { tags: true },
        orderBy: { [sortField]: order === "asc" ? "asc" : "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.knowledgeItem.count({ where }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error listing knowledge items:", error);
    return NextResponse.json(
      { error: "Failed to list knowledge items" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      content,
      type,
      sourceUrl,
      tags,
      autoSummarize,
      autoTag,
      fileName,
      fileType,
    } = body;

    if (!title || !content || !type) {
      return NextResponse.json(
        { error: "title, content, and type are required" },
        { status: 400 }
      );
    }

    let summary: string | undefined;
    let aiTags: string[] = [];

    if (autoSummarize) {
      const ai = await getAI();
      summary = await ai.summarize(content);
    }

    if (autoTag) {
      const ai = await getAI();
      const existingTags = await prisma.tag.findMany({ select: { name: true } });
      aiTags = await ai.autoTag(content, existingTags.map((t: { name: string }) => t.name));
    }

    const allTags = [...new Set([...(tags || []), ...aiTags])];

    const item = await prisma.knowledgeItem.create({
      data: {
        title,
        content,
        type,
        sourceUrl,
        summary,
        fileName,
        fileType,
        userId: session.user.id,
        tags: {
          connectOrCreate: allTags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: { tags: true },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating knowledge item:", error);
    return NextResponse.json(
      { error: "Failed to create knowledge item" },
      { status: 500 }
    );
  }
}
