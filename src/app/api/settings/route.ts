import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/settings?group=general  (or all if no group)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const group = searchParams.get("group") || undefined;

  const settings = await prisma.siteSetting.findMany({
    where: group ? { group } : undefined,
    orderBy: [{ group: "asc" }, { key: "asc" }],
  });

  // Return as key->value map for easy consumption
  const map: Record<string, string> = {};
  for (const s of settings) {
    map[s.key] = s.value;
  }

  return NextResponse.json({ settings, map });
}

// PUT /api/settings  body: { key: string, value: string }[]
export async function PUT(request: NextRequest) {
  const body = await request.json();

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Body must be an array" }, { status: 400 });
  }

  const results = await Promise.all(
    body.map(({ key, value }: { key: string; value: string }) =>
      prisma.siteSetting.update({
        where: { key },
        data: { value: String(value) },
      })
    )
  );

  return NextResponse.json({ updated: results.length });
}
