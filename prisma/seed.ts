import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

function parseDbUrl(url: string) {
  try {
    const u = new URL(url.replace(/^mysql2?:\/\//, "http://"));
    return { host: u.hostname || "127.0.0.1", port: parseInt(u.port) || 3306, user: decodeURIComponent(u.username) || "root", password: decodeURIComponent(u.password) || "", database: u.pathname.replace(/^\//, "") || "new_wardrobe" };
  } catch { return { host: "127.0.0.1", port: 3306, user: "root", password: "", database: "new_wardrobe" }; }
}

const conn = parseDbUrl(process.env.DATABASE_URL ?? "mysql://root:@localhost:3306/new_wardrobe");
const adapter = new PrismaMariaDb({ ...conn, connectionLimit: 5 });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@newwardrobe.com" },
    update: {},
    create: {
      email: "admin@newwardrobe.com",
      password: hashedPassword,
      name: "Admin",
      role: "SUPER_ADMIN",
    },
  });

  console.log("Admin kullanıcı oluşturuldu:", admin.email);

  const categories = [
    { name: "Gardıroplar", slug: "gardroplar", order: 1 },
    { name: "Dolaplar", slug: "dolaplar", order: 2 },
    { name: "Raflar", slug: "raflar", order: 3 },
    { name: "Aksesuarlar", slug: "aksesuarlar", order: 4 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        order: cat.order,
        description: `${cat.name} kategorisi`,
      },
    });
  }

  console.log("Kategoriler oluşturuldu");

  const sections = [
    {
      sectionKey: "hero",
      title: "Premium Mobilya Deneyimi",
      subtitle: "Hayalinizdeki mekanı tasarlayın, 3D olarak deneyimleyin.",
    },
    {
      sectionKey: "about",
      title: "Hakkımızda",
      subtitle: "Kalite ve tasarımı bir araya getiriyoruz.",
      body: "NEW WARDROBE olarak, yaşam alanlarınızı dönüştüren premium mobilya çözümleri sunuyoruz.",
    },
    {
      sectionKey: "features",
      title: "Neden Biz?",
      subtitle: "Farkımızı keşfedin.",
      metadata: JSON.stringify({
        items: [
          {
            title: "3D Görselleştirme",
            description: "Ürünlerimizi 3D olarak inceleyin",
            icon: "Box",
          },
          {
            title: "Sanal Oda Planlayıcı",
            description: "Mobilyalarınızı odanıza yerleştirin",
            icon: "Layout",
          },
          {
            title: "Premium Kalite",
            description: "En iyi malzemeler, en iyi işçilik",
            icon: "Award",
          },
          {
            title: "Ücretsiz Montaj",
            description: "Tüm ürünlerde ücretsiz kurulum",
            icon: "Wrench",
          },
        ],
      }),
    },
    {
      sectionKey: "cta",
      title: "Hayalinizdeki Odayı Tasarlayın",
      subtitle:
        "3D oda planlayıcımız ile mobilyalarınızı sanal ortamda deneyimleyin.",
    },
  ];

  for (const section of sections) {
    await prisma.contentSection.upsert({
      where: { sectionKey: section.sectionKey },
      update: {},
      create: section,
    });
  }

  console.log("İçerik bölümleri oluşturuldu");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
