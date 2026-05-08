import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { startConversion } from "@/lib/image-to-3d";

export async function POST(request: NextRequest) {
  const { productId, imageUrl } = await request.json();

  if (!productId || !imageUrl) {
    return NextResponse.json(
      { error: "productId ve imageUrl gerekli" },
      { status: 400 }
    );
  }

  const existing = await prisma.model3D.findUnique({ where: { productId } });
  if (existing && existing.status === "PROCESSING") {
    return NextResponse.json(
      { error: "Bu ürün için zaten bir dönüşüm devam ediyor" },
      { status: 409 }
    );
  }

  const { taskId, provider } = await startConversion(imageUrl);

  const model = existing
    ? await prisma.model3D.update({
        where: { productId },
        data: {
          sourceImageUrl: imageUrl,
          taskId,
          status: "PROCESSING",
          modelUrl: null,
          thumbnailUrl: null,
          errorMessage: null,
        },
      })
    : await prisma.model3D.create({
        data: {
          productId,
          sourceImageUrl: imageUrl,
          taskId,
          status: "PROCESSING",
        },
      });

  return NextResponse.json({ model, provider }, { status: 201 });
}
