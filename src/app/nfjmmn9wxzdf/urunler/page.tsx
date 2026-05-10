import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package } from "lucide-react";
import { ProductActions } from "@/components/admin/ProductActions";
import { ADMIN_PATH } from "@/lib/admin-config";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  let products: Awaited<ReturnType<typeof fetchProducts>> = [];

  async function fetchProducts() {
    return prisma.product.findMany({
      include: {
        category: true,
        images: { orderBy: { order: "asc" }, take: 1 },
        model3d: { select: { status: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  try {
    products = await fetchProducts();
  } catch {
    // DB not available
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ürünler</h1>
          <p className="text-muted-foreground mt-1">
            {products.length} ürün listeleniyor
          </p>
        </div>
        <Link href={`/${ADMIN_PATH}/urunler/yeni`}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Ürün
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold">Henüz ürün yok</h2>
          <p className="text-muted-foreground mt-1">
            İlk ürününüzü ekleyerek başlayın
          </p>
          <Link href={`/${ADMIN_PATH}/urunler/yeni`}>
            <Button className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Ürün Ekle
            </Button>
          </Link>
        </div>
      ) : (
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-3 sm:px-4 sm:py-4 text-sm font-medium text-muted-foreground">
                  Ürün
                </th>
                <th className="text-left px-3 py-3 sm:px-4 sm:py-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">
                  Kategori
                </th>
                <th className="text-left px-3 py-3 sm:px-4 sm:py-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">
                  Fiyat
                </th>
                <th className="text-left px-3 py-3 sm:px-4 sm:py-4 text-sm font-medium text-muted-foreground">
                  Durum
                </th>
                <th className="text-left px-3 py-3 sm:px-4 sm:py-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                  3D Model
                </th>
                <th className="text-right px-3 py-3 sm:px-4 sm:py-4 text-sm font-medium text-muted-foreground">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-3 py-3 sm:px-4 sm:py-4">
                    <Link
                      href={`/${ADMIN_PATH}/urunler/${product.id}`}
                      className="flex items-center gap-2 sm:gap-3 hover:text-primary transition-colors"
                    >
                      {product.images[0] ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className="font-medium truncate max-w-[100px] sm:max-w-none">{product.name}</span>
                    </Link>
                  </td>
                  <td className="px-3 py-3 sm:px-4 sm:py-4 text-sm text-muted-foreground hidden sm:table-cell">
                    {product.category?.name || "—"}
                  </td>
                  <td className="px-3 py-3 sm:px-4 sm:py-4 text-sm whitespace-nowrap hidden sm:table-cell">
                    {Number(product.price).toLocaleString("tr-TR")} ₺
                  </td>
                  <td className="px-3 py-3 sm:px-4 sm:py-4">
                    <Badge
                      variant={product.published ? "default" : "secondary"}
                    >
                      {product.published ? "Yayında" : "Taslak"}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 sm:px-4 sm:py-4 hidden md:table-cell">
                    {product.model3d ? (
                      <Badge
                        variant={
                          product.model3d.status === "COMPLETED"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {product.model3d.status === "COMPLETED"
                          ? "Hazır"
                          : product.model3d.status === "PROCESSING"
                            ? "İşleniyor"
                            : "Bekliyor"}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 sm:px-4 sm:py-4 text-right">
                    <ProductActions productId={product.id} productName={product.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
