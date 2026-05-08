import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const config = await prisma.roomConfiguration.create({
    data: {
      name: body.name || "Adsız Oda",
      roomWidth: body.roomWidth,
      roomHeight: body.roomHeight,
      roomDepth: body.roomDepth,
      objects: JSON.stringify(body.objects),
      cameraState: body.cameraState ? JSON.stringify(body.cameraState) : null,
      shareToken: nanoid(12),
    },
  });

  return NextResponse.json(config, { status: 201 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (token) {
    const config = await prisma.roomConfiguration.findUnique({
      where: { shareToken: token },
    });
    if (!config) {
      return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(config);
  }

  const configs = await prisma.roomConfiguration.findMany({
    orderBy: { updatedAt: "desc" },
    take: 20,
  });
  return NextResponse.json(configs);
}
