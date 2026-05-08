import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { productSchema } from "@/lib/validations/product";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      model3d: true,
      dimensions: true,
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  // Extract images from raw body BEFORE schema validation
  // (productSchema strips unknown fields, so images would be lost otherwise)
  const images: { id?: string; url: string; alt?: string | null; order?: number }[] | undefined =
    Array.isArray(body.images) ? body.images : undefined;

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Update product fields
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...parsed.data,
      price: parsed.data.price,
      salePrice: parsed.data.salePrice ?? null,
    },
  });

  // Sync images: delete removed ones, upsert existing/new
  if (images !== undefined) {
    const existingIds = images.filter((i) => i.id).map((i) => i.id as string);

    // Delete images not in the new list
    await prisma.productImage.deleteMany({
      where: {
        productId: id,
        ...(existingIds.length > 0 ? { id: { notIn: existingIds } } : {}),
      },
    });

    // Upsert each image in order
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (img.id) {
        await prisma.productImage.update({
          where: { id: img.id },
          data: { url: img.url, alt: img.alt ?? null, order: i },
        });
      } else {
        await prisma.productImage.create({
          data: { productId: id, url: img.url, alt: img.alt ?? null, order: i },
        });
      }
    }
  }

  // Return updated product with images
  const productWithImages = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json(productWithImages);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
