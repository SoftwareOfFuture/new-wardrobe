import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const projectSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
  images: z
    .array(
      z.object({
        id: z.string().optional(),
        url: z.string(),
        alt: z.string().nullable().optional(),
        order: z.number().int().optional(),
      })
    )
    .optional(),
});

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: { images: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { images, ...data } = parsed.data;

  const project = await prisma.project.create({ data });

  if (images && images.length > 0) {
    await prisma.projectImage.createMany({
      data: images.map((img, i) => ({
        projectId: project.id,
        url: img.url,
        alt: img.alt ?? null,
        order: i,
      })),
    });
  }

  return NextResponse.json(project, { status: 201 });
}
