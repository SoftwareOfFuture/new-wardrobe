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
    <div className="flex items-center sm:justify-center gap-2 sm:gap-2.5 mb-8 sm:mb-12 flex-nowrap sm:flex-wrap overflow-x-auto pb-2 sm:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
      {[{ name: "Tümü", slug: undefined }, ...categories].map((cat) => {
        const isActive = cat.slug === activeSlug || (!cat.slug && !activeSlug);
        return (
          <button
            key={cat.slug ?? "all"}
            onClick={() => handleSelect(cat.slug)}
            className="px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0"
            style={
              isActive
                ? { background: "#D4A853", color: "#09090b", fontWeight: 600 }
                : {
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(212,168,83,0.18)",
                    color: "rgba(255,255,255,0.65)",
                  }
            }
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,168,83,0.5)";
                (e.currentTarget as HTMLButtonElement).style.color = "#D4A853";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,168,83,0.18)";
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.65)";
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
