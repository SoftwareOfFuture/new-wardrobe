import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const sections = await prisma.contentSection.findMany({
    orderBy: { sectionKey: "asc" },
  });

  return NextResponse.json(sections);
}
