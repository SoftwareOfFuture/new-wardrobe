import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

type TitleEntry = {
  title: string;
  description?: string;
};

// Based on `urbanportfoy (1).pdf` page headings (2025).
// Keys are portfolio page numbers (07..46). Pages outside this range are
// intro/sections/contact and should not appear as individual projects.
const PDF_PAGE_TITLES: Record<number, TitleEntry> = {
  7: { title: "GLORİA SERENİTY RESORT (AKA A LA CARTE RESTAURANT)" },
  8: { title: "GLORİA SERENİTY RESORT (AKA A LA CARTE RESTAURANT)" },
  9: { title: "GLORİA SERENİTY RESORT (POLO BAR)" },
  10: { title: "DOBEDAN EXCLUSİVE HOTEL (STANDART ODA)" },
  11: { title: "DOBEDAN EXCLUSİVE HOTEL (STANDART ODA)" },
  12: { title: "DOBEDAN EXCLUSİVE HOTEL (QUADRİPLE ODA)" },
  13: { title: "DOBEDAN EXCLUSİVE HOTEL (AİLE ODASI)" },
  14: { title: "DOBEDAN EXCLUSİVE HOTEL (AİLE ODASI)" },
  15: { title: "DOBEDAN EXCLUSİVE RESORT (FRENCH PATİSSERİE BAR)" },
  16: { title: "DOBEDAN BEACH RESORT (STANDART ODA)" },
  17: { title: "DOBEDAN BEACH RESORT (ROYAL SUİT)" },
  18: { title: "DOBEDAN BEACH RESORT (ROYAL SUİT)" },
  19: { title: "DOBEDAN BEACH RESORT (ROYAL SUİT)" },
  20: { title: "DOBEDAN WORLD PALACE (SUPERİOR STANDART ODA)" },
  21: { title: "DOBEDAN WORLD PALACE (SUPERİOR DUPLEX FAMİLY ODA)" },
  22: { title: "DOBEDAN WORLD PALACE (SUPERİOR DUPLEX FAMİLY ODA)" },
  23: { title: "DOBEDAN WORLD PALACE (SUPERİOR DUPLEX FAMİLY ODA)" },
  24: { title: "DOBEDAN WORLD PALACE (SEPERATOR)" },
  25: { title: "SUSESİ LUXURY RESORT (DELUXE ODA)" },
  26: { title: "SUSESİ LUXURY RESORT (ROYAL SUIT)" },
  27: { title: "SUSESİ LUXURY RESORT (ROYAL SUIT)" },
  28: { title: "SUSESİ LUXURY RESORT (JUNIOR ROYAL SUIT)" },
  29: { title: "SUSESİ LUXURY RESORT (JUNIOR ROYAL SUIT)" },
  30: { title: "SUSESİ LUXURY RESORT (FAMILY TRIPLEX)" },
  31: { title: "SUSESİ LUXURY RESORT (FAMILY TRIPLEX)" },
  32: { title: "SUSESİ LUXURY RESORT (SENIOR SUİTE)" },
  33: { title: "SUSESİ LUXURY RESORT (SENIOR SUİTE)" },
  34: { title: "SUSESİ LUXURY RESORT (SENIOR SUİTE)" },
  35: { title: "SUSESİ LUXURY RESORT (DELUXE SUPERİOR)" },
  36: { title: "SUSESİ LUXURY RESORT (DELUXE SUPERİOR)" },
  37: { title: "SUSESİ LUXURY RESORT (LAKE SUIT)" },
  38: { title: "SUSESİ LUXURY RESORT (LAKE SUIT)" },
  39: { title: "SUSESİ LUXURY RESORT (LAKE SUIT)" },
  40: { title: "MAT METAL (İSTANBUL)" },
  41: { title: "MAT METAL (İSTANBUL)" },
  42: { title: "MAT METAL (İSTANBUL)" },
  43: { title: "MAT METAL (İSTANBUL)" },
  44: { title: "PAVELSİS AVİYONİK TEKNOLOJİ ÜRETİM TİCARET A.Ş." },
  45: { title: "PAVELSİS AVİYONİK TEKNOLOJİ ÜRETİM TİCARET A.Ş." },
  46: { title: "PAVELSİS AVİYONİK TEKNOLOJİ ÜRETİM TİCARET A.Ş." },
};

function makeDescription(title: string, pageNo: number) {
  return (
    `Portföy çalışması (PDF Sayfa ${String(pageNo).padStart(2, "0")}). ` +
    `Urban Mobilya tarafından projeye özel üretim ve uygulama. (${title})`
  );
}

const pool = new Pool({
  connectionString:
    process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL ?? "",
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const keepOrders = new Set(Object.keys(PDF_PAGE_TITLES).map((k) => Number(k)));

  // 1) Remove product-as-project pollution (do not delete products; just unset flag)
  const prodRes = await prisma.product.updateMany({
    where: { isProject: true },
    data: { isProject: false },
  });

  // 2) Delete legacy projects that are not in the PDF portfolio pages
  const legacyProjects = await prisma.project.findMany({
    where: { slug: { startsWith: "proje-" } },
    select: { id: true, slug: true, order: true },
  });

  const toDelete = legacyProjects.filter((p) => !keepOrders.has(p.order));
  if (toDelete.length > 0) {
    await prisma.projectImage.deleteMany({
      where: { projectId: { in: toDelete.map((p) => p.id) } },
    });
    await prisma.project.deleteMany({
      where: { id: { in: toDelete.map((p) => p.id) } },
    });
  }

  // 3) Update remaining legacy portfolio projects with proper titles + better descriptions
  for (const [pageNoRaw, entry] of Object.entries(PDF_PAGE_TITLES)) {
    const pageNo = Number(pageNoRaw);
    const slug = `proje-${String(pageNo).padStart(2, "0")}`;

    await prisma.project.updateMany({
      where: { slug },
      data: {
        name: entry.title,
        description: entry.description ?? makeDescription(entry.title, pageNo),
        published: true,
        order: pageNo,
        category: "Portfolyo",
      },
    });
  }

  console.log(
    JSON.stringify(
      {
        unsetProductIsProjectCount: prodRes.count,
        deletedLegacyProjectsCount: toDelete.length,
        keptLegacyProjectsCount: legacyProjects.length - toDelete.length,
        updatedPortfolioTitlesCount: Object.keys(PDF_PAGE_TITLES).length,
      },
      null,
      2
    )
  );
}

main()
  .catch((err) => {
    console.error("cleanup-legacy-portfolio failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

