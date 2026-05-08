import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { productSchema } from "@/lib/validations/product";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || undefined;
  const published = searchParams.get("published");

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search } },
        { description: { contains: search } },
      ],
    }),
    ...(categoryId && { categoryId }),
    ...(published !== null && published !== undefined && {
      published: published === "true",
    }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: { orderBy: { order: "asc" }, take: 1 },
        model3d: { select: { status: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Extract images before schema validation (not part of product schema)
  const images: { id?: string; url: string; alt?: string | null; order?: number }[] =
    Array.isArray(body.images) ? body.images : [];

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Create product
  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      price: parsed.data.price,
      salePrice: parsed.data.salePrice ?? null,
    },
  });

  // Save images to ProductImage table
  if (images.length > 0) {
    await prisma.productImage.createMany({
      data: images.map((img, i) => ({
        productId: product.id,
        url: img.url,
        alt: img.alt ?? null,
        order: img.order ?? i,
      })),
    });
  }

  // Return product with images
  const productWithImages = await prisma.product.findUnique({
    where: { id: product.id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json(productWithImages, { status: 201 });
}
