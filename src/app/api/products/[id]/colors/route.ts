import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// GET /api/products/[id]/colors
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const colors = await (prisma as any).productColorVariant.findMany({
      where: { productId: id },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(colors);
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

// POST /api/products/[id]/colors
export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const { name, hex } = await req.json();
    if (!name || !hex) {
      return NextResponse.json({ error: "name ve hex gerekli" }, { status: 400 });
    }

    const last = await (prisma as any).productColorVariant.findFirst({
      where: { productId: id },
      orderBy: { order: "desc" },
    });

    const color = await (prisma as any).productColorVariant.create({
      data: { productId: id, name, hex, order: (last?.order ?? -1) + 1 },
    });
    return NextResponse.json(color, { status: 201 });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

// DELETE /api/products/[id]/colors?colorId=xxx
export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const colorId = searchParams.get("colorId");

  if (!colorId) return NextResponse.json({ error: "colorId gerekli" }, { status: 400 });

  try {
    await (prisma as any).productColorVariant.deleteMany({
      where: { id: colorId, productId: id },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
