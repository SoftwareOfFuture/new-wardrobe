import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  let categories: { id: string; name: string }[] = [];

  try {
    categories = await prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { order: "asc" },
    });
  } catch {
    // DB not available
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Yeni Ürün</h1>
        <p className="text-muted-foreground mt-1">Yeni bir ürün oluşturun</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
