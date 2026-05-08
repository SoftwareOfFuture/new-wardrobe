import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { deleteImage } from "@/lib/cloudinary";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }

  const urlParts = media.url.split("/upload/");
  if (urlParts.length === 2) {
    const publicId = urlParts[1]
      .replace(/^v\d+\//, "")
      .replace(/\.[^.]+$/, "");
    try {
      await deleteImage(publicId);
    } catch {
      // Cloudinary deletion failure shouldn't block DB cleanup
    }
  }

  await prisma.media.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
