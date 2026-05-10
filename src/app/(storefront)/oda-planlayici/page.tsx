import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/db";
import { RoomPlannerClient } from "./client";
import type { AvailableModel } from "@/types/room-planner";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return { title: settings["pagetitle.planner"] || "Urban Creative" };
}

export default async function RoomPlannerPage() {
  let availableModels: AvailableModel[] = [];

  try {
    const db = prisma as any;

    const models = await db.model3D.findMany({
      where: { status: "COMPLETED", modelUrl: { not: null } },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: { select: { url: true }, orderBy: { order: "asc" }, take: 1 },
          },
        },
      },
    });

    // Fetch color variants per product
    availableModels = await Promise.all(
      (models as any[])
        .filter((m: any) => m.modelUrl)
        .map(async (m: any) => {
          const colorVariants = await db.productColorVariant.findMany({
            where: { productId: m.product.id },
            orderBy: { order: "asc" },
            select: { id: true, name: true, hex: true },
          });
          return {
            productId: m.product.id,
            productName: m.product.name,
            modelUrl: m.modelUrl as string,
            thumbnailUrl: (m.thumbnailUrl ?? m.product.images[0]?.url) as string | undefined,
            colorVariants,
          };
        })
    );
  } catch {
    // DB not available
  }

  return <RoomPlannerClient availableModels={availableModels} />;
}
