import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (files.length === 0) {
    return NextResponse.json({ error: "Dosya seçilmedi" }, { status: 400 });
  }

  const results = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, publicId, width, height } = await uploadImage(
      buffer,
      "new-wardrobe/media"
    );

    const media = await prisma.media.create({
      data: {
        filename: file.name,
        url,
        mimeType: file.type,
        size: file.size,
        width,
        height,
        folder: "media",
      },
    });

    results.push(media);
  }

  return NextResponse.json(results, { status: 201 });
}
