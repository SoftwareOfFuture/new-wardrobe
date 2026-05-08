import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contentSectionSchema } from "@/lib/validations/content";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  const { sectionId } = await params;
  const body = await request.json();
  const parsed = contentSectionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const section = await prisma.contentSection.update({
    where: { id: sectionId },
    data: {
      ...parsed.data,
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  return NextResponse.json(section);
}
