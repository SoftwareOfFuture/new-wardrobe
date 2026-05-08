"use client";

import { useRouter } from "next/navigation";

interface CategoryFilterProps {
  categories: { id: string; name: string; slug: string }[];
  activeSlug?: string;
}

export function CategoryFilter({ categories, activeSlug }: CategoryFilterProps) {
  const router = useRouter();

  const handleSelect = (slug?: string) => {
    if (slug) {
      router.push(`/urunler?category=${slug}`);
    } else {
      router.push("/urunler");
    }
  };

  return (
    <div className="flex items-center justify-center gap-2.5 mb-12 flex-wrap">
      {[{ name: "Tümü", slug: undefined }, ...categories].map((cat) => {
        const isActive = cat.slug === activeSlug || (!cat.slug && !activeSlug);
        return (
          <button
            key={cat.slug ?? "all"}
            onClick={() => handleSelect(cat.slug)}
            className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
            style={
              isActive
                ? { background: "#D4A853", color: "#09090b", fontWeight: 600 }
                : {
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "oklch(0.6 0 0)",
                  }
            }
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,168,83,0.4)";
                (e.currentTarget as HTMLButtonElement).style.color = "#D4A853";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.10)";
                (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.6 0 0)";
              }
            }}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
