import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/storefront/ScrollReveal";
import { ProductViewer3DWrapper } from "@/components/storefront/ProductViewer3DWrapper";
import { ProductImageGallery } from "@/components/storefront/ProductImageGallery";
import { Box, Ruler, ArrowLeft, Package, Tag, Layers, CheckCircle, Phone } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let name = "Ürün";
  try {
    const p = await prisma.product.findUnique({ where: { slug }, select: { name: true } });
    if (p) name = p.name;
  } catch { /* */ }
  return { title: `${name} | Ürünler | Urban Mobilya` };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  type ProductWithRelations = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: unknown;
    salePrice: unknown;
    sku: string | null;
    images: { id: string; url: string; alt: string | null; order: number }[];
    category: { id: string; name: string; slug: string } | null;
    model3d: { status: string; modelUrl: string | null } | null;
    dimensions: { width: number | null; height: number | null; depth: number | null } | null;
  };

  let product: ProductWithRelations | null = null;

  try {
    const raw = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: "asc" } },
        category: true,
        model3d: true,
        dimensions: true,
      },
    });
    if (!raw) return notFound();
    product = raw as unknown as ProductWithRelations;
  } catch {
    return notFound();
  }

  if (!product) return notFound();

  const has3DModel = product.model3d?.status === "COMPLETED" && product.model3d?.modelUrl;
  const discount = product.salePrice
    ? Math.round((1 - Number(product.salePrice) / Number(product.price)) * 100)
    : null;

  const features = [
    "Yüksek kaliteli malzeme",
    "Uzun ömürlü dayanıklı yapı",
    "Modern ve şık tasarım",
    "Kolay montaj",
  ];

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] opacity-[0.025]"
          style={{ background: "radial-gradient(circle, #D4A853 0%, transparent 70%)" }} />
      </div>

      <div className="pt-32 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Breadcrumb */}
          <ScrollReveal className="mb-10">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
              <span>/</span>
              <Link href="/urunler" className="hover:text-primary transition-colors">Ürünler</Link>
              {product.category && (
                <>
                  <span>/</span>
                  <Link href={`/urunler?category=${product.category.slug}`}
                    className="hover:text-primary transition-colors">
                    {product.category.name}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-foreground font-medium truncate max-w-40">{product.name}</span>
            </nav>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 mb-20">

            {/* Left: Gallery */}
            <ScrollReveal>
              <ProductImageGallery
                images={product.images}
                productName={product.name}
              />
              {product.images.length === 0 && (
                <div className="aspect-square rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <Package className="w-16 h-16 opacity-10" style={{ color: "#D4A853" }} />
                </div>
              )}
            </ScrollReveal>

            {/* Right: Product info */}
            <ScrollReveal direction="right">
              <div className="space-y-7">

                {/* Category + badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {product.category && (
                    <span className="badge-gold">{product.category.name}</span>
                  )}
                  {has3DModel && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: "rgba(9,9,11,0.8)", color: "#D4A853", border: "1px solid rgba(212,168,83,0.3)" }}>
                      <Box className="w-3 h-3" />3D Görünüm
                    </span>
                  )}
                  {discount && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: "rgba(220,38,38,0.15)", color: "#ef4444", border: "1px solid rgba(220,38,38,0.3)" }}>
                      <Tag className="w-3 h-3" />−{discount}% İndirim
                    </span>
                  )}
                </div>

                {/* Name */}
                <div>
                  <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight leading-tight">
                    {product.name}
                  </h1>
                  {product.sku && (
                    <p className="mt-2 text-xs text-muted-foreground font-mono">SKU: {product.sku}</p>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 py-4"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {product.salePrice ? (
                    <>
                      <span className="text-4xl font-bold text-gradient-gold">
                        {Number(product.salePrice).toLocaleString("tr-TR")} ₺
                      </span>
                      <span className="text-xl text-muted-foreground line-through">
                        {Number(product.price).toLocaleString("tr-TR")} ₺
                      </span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-gradient-gold">
                      {Number(product.price).toLocaleString("tr-TR")} ₺
                    </span>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {product.description}
                  </p>
                )}

                {/* Dimensions */}
                {product.dimensions && (product.dimensions.width || product.dimensions.height || product.dimensions.depth) && (
                  <div className="rounded-2xl p-5"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <Ruler className="w-4 h-4" style={{ color: "#D4A853" }} />
                      <span className="text-sm font-semibold uppercase tracking-wider">Boyutlar (cm)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      {[
                        { label: "Genişlik", val: product.dimensions.width },
                        { label: "Yükseklik", val: product.dimensions.height },
                        { label: "Derinlik", val: product.dimensions.depth },
                      ].map(({ label, val }) => val && (
                        <div key={label} className="rounded-xl py-3"
                          style={{ background: "rgba(212,168,83,0.05)", border: "1px solid rgba(212,168,83,0.1)" }}>
                          <p className="text-2xl font-bold text-gradient-gold">{val}</p>
                          <p className="text-xs text-muted-foreground mt-1">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "#D4A853" }} />
                      {feat}
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/iletisim"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 hover:glow-gold-subtle hover:scale-[1.02]"
                    style={{ background: "#D4A853", color: "#09090b" }}
                  >
                    <Phone className="w-4 h-4" />
                    Fiyat Teklifi Al
                  </Link>
                  {has3DModel && (
                    <Link
                      href={`/oda-planlayici?urun=${product.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-medium transition-all duration-300 hover:border-primary/40"
                      style={{ background: "rgba(212,168,83,0.07)", border: "1px solid rgba(212,168,83,0.2)", color: "#D4A853" }}
                    >
                      <Box className="w-4 h-4" />
                      Sanal Oda ile Gör
                    </Link>
                  )}
                </div>

                {/* Trust badges */}
                <div className="flex items-center gap-6 pt-2">
                  {[
                    { label: "Ücretsiz Keşif" },
                    { label: "Fabrika Garantisi" },
                    { label: "Hızlı Teslimat" },
                  ].map(({ label }) => (
                    <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#D4A853" }} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* 3D Viewer section */}
          {has3DModel && (
            <ScrollReveal className="mb-20">
              <div className="rounded-3xl overflow-hidden"
                style={{ border: "1px solid rgba(212,168,83,0.15)", background: "rgba(212,168,83,0.02)" }}>
                <div className="px-8 py-6 flex items-center gap-3"
                  style={{ borderBottom: "1px solid rgba(212,168,83,0.1)" }}>
                  <div className="p-2 rounded-lg" style={{ background: "rgba(212,168,83,0.1)" }}>
                    <Layers className="w-5 h-5" style={{ color: "#D4A853" }} />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">3D <span className="text-gradient-gold">Görünüm</span></h2>
                    <p className="text-xs text-muted-foreground">Ürünü tüm açılardan inceleyin</p>
                  </div>
                </div>
                <ProductViewer3DWrapper
                  modelUrl={product.model3d!.modelUrl!}
                  className="h-[500px]"
                />
              </div>
            </ScrollReveal>
          )}

          {/* Related navigation */}
          <ScrollReveal>
            <div className="flex items-center justify-between py-10"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <Link
                href="/urunler"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors group text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Tüm Ürünlere Dön
              </Link>
              {product.category && (
                <Link
                  href={`/urunler?category=${product.category.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all"
                  style={{ background: "rgba(212,168,83,0.06)", border: "1px solid rgba(212,168,83,0.15)", color: "#D4A853" }}
                >
                  {product.category.name} Ürünleri
                </Link>
              )}
            </div>
          </ScrollReveal>

        </div>
      </div>
    </div>
  );
}
