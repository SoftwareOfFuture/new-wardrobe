import Link from "next/link";
import { prisma } from "@/lib/db";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { ADMIN_PATH } from "@/lib/admin-config";

export default async function AdminDashboardPage() {
  let stats = {
    totalProducts: 0,
    publishedProducts: 0,
    totalCategories: 0,
    total3DModels: 0,
  };

  try {
    const [totalProducts, publishedProducts, totalCategories, total3DModels] =
      await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { published: true } }),
        prisma.category.count(),
        prisma.model3D.count({ where: { status: "COMPLETED" } }),
      ]);

    stats = {
      totalProducts,
      publishedProducts,
      totalCategories,
      total3DModels,
    };
  } catch {
    // DB not available yet
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Mağazanızın genel durumunu görüntüleyin
        </p>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Son Eklenen Ürünler</h2>
          <p className="text-sm text-muted-foreground">
            Henüz ürün eklenmemiş. Ürün eklemek için{" "}
            <Link href={`/${ADMIN_PATH}/urunler/yeni`} className="text-primary underline">
              buraya tıklayın
            </Link>
            .
          </p>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Hızlı İşlemler</h2>
          <div className="space-y-2">
            <Link
              href={`/${ADMIN_PATH}/urunler/yeni`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
            >
              <span className="text-primary">+</span>
              <span className="text-sm">Yeni Ürün Ekle</span>
            </Link>
            <Link
              href={`/${ADMIN_PATH}/kategoriler`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
            >
              <span className="text-primary">+</span>
              <span className="text-sm">Kategori Yönet</span>
            </Link>
            <Link
              href={`/${ADMIN_PATH}/icerik`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
            >
              <span className="text-primary">✎</span>
              <span className="text-sm">İçerik Düzenle</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
