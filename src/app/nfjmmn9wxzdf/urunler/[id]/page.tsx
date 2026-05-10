import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = prisma as any;

  let product: any;
  let categories: { id: string; name: string }[] = [];

  try {
    [product, categories] = await Promise.all([
      db.product.findUnique({
        where: { id },
        include: { images: true, model3d: true, dimensions: true },
      }),
      db.category.findMany({
        select: { id: true, name: true },
        orderBy: { order: "asc" },
      }),
    ]);
  } catch {
    notFound();
  }

  if (!product) notFound();

  // Fetch color variants separately
  let colorVariants: { id: string; name: string; hex: string; order: number }[] = [];
  try {
    colorVariants = await db.productColorVariant.findMany({
      where: { productId: id },
      orderBy: { order: "asc" },
    });
  } catch { /* ignore */ }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ürünü Düzenle</h1>
        <p className="text-muted-foreground mt-1">{product.name}</p>
      </div>
      <ProductForm
        categories={categories}
        initialData={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: Number(product.price),
          salePrice: product.salePrice ? Number(product.salePrice) : null,
          sku: product.sku,
          stock: product.stock,
          featured: product.featured,
          published: product.published,
          isProject: product.isProject,
          categoryId: product.categoryId,
          tags: product.tags,
          images: product.images.map((img: any) => ({
            id: img.id,
            url: img.url,
            alt: img.alt,
            order: img.order,
          })),
          model3d: product.model3d
            ? {
                id: product.model3d.id,
                status: product.model3d.status,
                modelUrl: product.model3d.modelUrl,
                sourceImageUrl: product.model3d.sourceImageUrl,
                taskId: product.model3d.taskId,
                errorMessage: product.model3d.errorMessage,
              }
            : null,
          colorVariants,
        }}
      />
    </div>
  );
}
