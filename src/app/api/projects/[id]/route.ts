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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!project) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { images, ...data } = parsed.data;

  const project = await prisma.project.update({ where: { id }, data });

  if (images !== undefined) {
    await prisma.projectImage.deleteMany({
      where: {
        projectId: id,
        ...(images.length > 0
          ? { id: { notIn: images.filter((i) => i.id).map((i) => i.id as string) } }
          : {}),
      },
    });
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (img.id) {
        await prisma.projectImage.update({
          where: { id: img.id },
          data: { url: img.url, alt: img.alt ?? null, order: i },
        });
      } else {
        await prisma.projectImage.create({
          data: { projectId: id, url: img.url, alt: img.alt ?? null, order: i },
        });
      }
    }
  }

  return NextResponse.json(project);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
