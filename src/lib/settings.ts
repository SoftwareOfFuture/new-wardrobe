import { prisma } from "@/lib/db";
import { cache } from "react";

export type SettingsMap = Record<string, string>;

/**
 * Fetch all site settings as a key→value map.
 * Cached per-request in React Server Components (React cache).
 */
export const getSettings = cache(async (): Promise<SettingsMap> => {
  try {
    const rows = await prisma.siteSetting.findMany();
    const map: SettingsMap = {};
    for (const row of rows) {
      map[row.key] = row.value;
    }
    return map;
  } catch {
    return {};
  }
});

/** Helper: get a single setting value with optional fallback */
export async function getSetting(key: string, fallback = ""): Promise<string> {
  const settings = await getSettings();
  return settings[key] ?? fallback;
}

/** Parse JSON setting safely */
export function parseJsonSetting<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
