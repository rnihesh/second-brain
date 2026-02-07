import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tags = await prisma.tag.findMany({
      where: {
        knowledgeItems: {
          some: { userId: session.user.id },
        },
      },
      include: {
        _count: {
          select: {
            knowledgeItems: {
              where: { userId: session.user.id },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Error listing tags:", error);
    return NextResponse.json(
      { error: "Failed to list tags" },
      { status: 500 }
    );
  }
}
