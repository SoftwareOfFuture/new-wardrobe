import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

type UploadedImage = {
  file: string;
  url: string;
  public_id?: string;
};

type ParsedFixImage = {
  productKey: "minar-kale" | "maride-1";
  url: string;
  alt: string;
  order: number;
};

const LEGACY_IMAGES_JSON =
  process.env.LEGACY_IMAGES_JSON ?? "C:/Users/kerem/Downloads/uploaded_images.json";
const LEGACY_FIX_IMG_SQL =
  process.env.LEGACY_FIX_IMG_SQL ?? path.resolve(process.cwd(), "fix_img.sql");

const pool = new Pool({
  connectionString:
    process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL ?? "",
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function parsePageGroup(fileName: string) {
  const match = /^page(\d+)_img(\d+)\.(jpe?g|png)$/i.exec(fileName);
  if (!match) return null;
  return {
    pageNo: Number(match[1]),
    imageNo: Number(match[2]),
  };
}

function parseFixImgRows(sql: string): ParsedFixImage[] {
  const rowRegex =
    /\('([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*(\d+)\)/g;
  const parsed: ParsedFixImage[] = [];
  let match: RegExpExecArray | null;

  while ((match = rowRegex.exec(sql)) !== null) {
    const [, , , url, alt, orderRaw] = match;
    const altLower = alt.toLowerCase();

    let productKey: ParsedFixImage["productKey"] | null = null;
    if (altLower.includes("minar-kale")) productKey = "minar-kale";
    if (altLower.includes("maride")) productKey = "maride-1";
    if (!productKey) continue;

    parsed.push({
      productKey,
      url,
      alt,
      order: Number(orderRaw),
    });
  }

  return parsed;
}

async function restoreProjectsFromUploadedImages() {
  const raw = await fs.readFile(LEGACY_IMAGES_JSON, "utf-8");
  const items = JSON.parse(raw) as UploadedImage[];

  const grouped = new Map<number, { imageNo: number; url: string }[]>();

  for (const item of items) {
    const parsed = parsePageGroup(item.file);
    if (!parsed) continue;
    const list = grouped.get(parsed.pageNo) ?? [];
    list.push({ imageNo: parsed.imageNo, url: item.url });
    grouped.set(parsed.pageNo, list);
  }

  const pageNos = [...grouped.keys()].sort((a, b) => a - b);

  for (const pageNo of pageNos) {
    const slug = `proje-${String(pageNo).padStart(2, "0")}`;
    const name = `Proje ${String(pageNo).padStart(2, "0")}`;
    const images = (grouped.get(pageNo) ?? []).sort(
      (a, b) => a.imageNo - b.imageNo
    );

    const project = await prisma.project.upsert({
      where: { slug },
      update: {
        name,
        published: true,
        order: pageNo,
        description: `Legacy portfoy geri yukleme - Sayfa ${pageNo}`,
      },
      create: {
        name,
        slug,
        published: true,
        order: pageNo,
        description: `Legacy portfoy geri yukleme - Sayfa ${pageNo}`,
      },
      select: { id: true },
    });

    await prisma.projectImage.deleteMany({ where: { projectId: project.id } });
    await prisma.projectImage.createMany({
      data: images.map((img, idx) => ({
        projectId: project.id,
        url: img.url,
        alt: `${name} - Gorsel ${img.imageNo}`,
        order: idx,
      })),
    });
  }

  return pageNos.length;
}

async function restoreProductsFromFixImg() {
  const sql = await fs.readFile(LEGACY_FIX_IMG_SQL, "utf-8");
  const parsed = parseFixImgRows(sql);

  const productConfigs = [
    {
      key: "minar-kale" as const,
      name: "Minar Kale Dolap",
      slug: "minar-kale-dolap",
      description: "Legacy urun geri yukleme (fix_img.sql).",
    },
    {
      key: "maride-1" as const,
      name: "Maride 1",
      slug: "maride-1",
      description: "Legacy urun geri yukleme (fix_img.sql).",
    },
  ];

  let restored = 0;
  for (const cfg of productConfigs) {
    const images = parsed
      .filter((row) => row.productKey === cfg.key)
      .sort((a, b) => a.order - b.order);

    if (!images.length) continue;

    const product = await prisma.product.upsert({
      where: { slug: cfg.slug },
      update: {
        name: cfg.name,
        description: cfg.description,
        published: true,
      },
      create: {
        name: cfg.name,
        slug: cfg.slug,
        description: cfg.description,
        price: "0.00",
        stock: 0,
        featured: false,
        published: true,
      },
      select: { id: true },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: images.map((img, idx) => ({
        productId: product.id,
        url: img.url,
        alt: img.alt,
        order: idx,
      })),
    });

    restored += 1;
  }

  return restored;
}

async function main() {
  const projectCount = await restoreProjectsFromUploadedImages();
  const productCount = await restoreProductsFromFixImg();
  console.log(`Restored projects: ${projectCount}`);
  console.log(`Restored products: ${productCount}`);
}

main()
  .catch((err) => {
    console.error("Legacy restore failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
