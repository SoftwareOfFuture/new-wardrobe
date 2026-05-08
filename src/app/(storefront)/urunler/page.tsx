import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ScrollReveal } from "@/components/storefront/ScrollReveal";
import { CategoryFilter } from "@/components/storefront/CategoryFilter";
import { Package } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return { title: settings["pagetitle.products"] || "Ürünler" };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;

  let products: {
    id: string; name: string; slug: string; price: number;
    salePrice: number | null; imageUrl?: string; category?: string; has3DModel: boolean;
  }[] = [];
  let categories: { id: string; name: string; slug: string }[] = [];

  try {
    const selectedCategory = categorySlug
      ? await prisma.category.findUnique({ where: { slug: categorySlug } })
      : null;

    const [rawProducts, rawCategories] = await Promise.all([
      prisma.product.findMany({
        where: {
          published: true,
          isProject: false,
          ...(selectedCategory ? { categoryId: selectedCategory.id } : {}),
        },
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          category: true,
          model3d: { select: { status: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        select: { id: true, name: true, slug: true },
        orderBy: { order: "asc" },
      }),
    ]);

    products = rawProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
      imageUrl: p.images[0]?.url,
      category: p.category?.name,
      has3DModel: p.model3d?.status === "COMPLETED",
    }));
    categories = rawCategories;
  } catch {
    // DB not available
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)", transform: "translate(20%, -20%)" }} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-6"
              style={{ background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.2)", color: "#D4A853" }}>
              Koleksiyonumuz
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-5">
              Tüm <span className="text-gradient-gold">Ürünler</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Premium mobilya koleksiyonumuzu keşfedin
            </p>
          </div>
        </ScrollReveal>

        {/* Category filter (client component) */}
        {categories.length > 0 && (
          <ScrollReveal delay={0.1}>
            <CategoryFilter categories={categories} activeSlug={categorySlug} />
          </ScrollReveal>
        )}

        {/* Products grid */}
        {products.length === 0 ? (
          <ScrollReveal>
            <div className="flex flex-col items-center justify-center py-32 gap-5">
              <div className="p-6 rounded-2xl" style={{ background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.15)" }}>
                <Package className="w-12 h-12" style={{ color: "#D4A853" }} />
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold mb-2">
                  {categorySlug ? "Bu kategoride ürün bulunamadı" : "Henüz ürün eklenmemiş"}
                </p>
                <p className="text-muted-foreground text-sm">Yakında yeni ürünler eklenecek.</p>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-8">
              <span className="text-foreground font-medium">{products.length}</span> ürün listeleniyor
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 0.04}>
                  <ProductCard {...product} />
                </ScrollReveal>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
