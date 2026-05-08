"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Package, Box, ArrowRight } from "lucide-react";
import { useRef } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  imageUrl?: string;
  category?: string;
  has3DModel?: boolean;
}

export function ProductCard({
  name,
  slug,
  price,
  salePrice,
  imageUrl,
  category,
  has3DModel,
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 220, damping: 22 });
  const glareX  = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY  = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  const discount = salePrice ? Math.round((1 - salePrice / price) * 100) : null;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: "900px" }}
      className="group cursor-pointer"
    >
      <Link href={`/urunler/${slug}`} className="block h-full">
        <div
          className="relative rounded-2xl overflow-hidden h-full transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.08)",
            transform: "translateZ(0)",
          }}
        >
          {/* Image */}
          <div className="relative aspect-[4/3] bg-white/5 overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover transition-transform duration-600 group-hover:scale-[1.06]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-12 h-12 text-muted-foreground/20" />
              </div>
            )}

            {/* Dynamic glare */}
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.07) 0%, transparent 55%)` }}
            />

            {/* Gradient fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Top badges */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-2">
              {discount && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "rgba(220,38,38,0.85)", color: "#fff" }}>
                  −{discount}%
                </span>
              )}
              {has3DModel && (
                <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
                  style={{ background: "rgba(9,9,11,0.8)", color: "#D4A853", border: "1px solid rgba(212,168,83,0.3)" }}>
                  <Box className="w-2.5 h-2.5" />3D
                </span>
              )}
            </div>

            {/* View arrow */}
            <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
              style={{ background: "#D4A853" }}>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </div>
          </div>

          {/* Info */}
          <div className="p-4" style={{ transform: "translateZ(12px)" }}>
            {category && (
              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase mb-1.5" style={{ color: "#D4A853" }}>
                {category}
              </p>
            )}
            <h3 className="font-medium text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-3">
              {name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2">
              {salePrice ? (
                <>
                  <span className="text-base font-bold" style={{ color: "#D4A853" }}>
                    {salePrice.toLocaleString("tr-TR")} ₺
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    {price.toLocaleString("tr-TR")} ₺
                  </span>
                </>
              ) : (
                <span className="text-base font-bold text-foreground">
                  {price.toLocaleString("tr-TR")} ₺
                </span>
              )}
            </div>
          </div>

          {/* Bottom hover glow line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
            style={{ background: "linear-gradient(90deg, transparent, #D4A853, transparent)" }} />
        </div>
      </Link>
    </motion.div>
  );
}
