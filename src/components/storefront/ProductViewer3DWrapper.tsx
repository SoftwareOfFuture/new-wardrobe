"use client";

import dynamic from "next/dynamic";

const ProductViewer3D = dynamic(
  () =>
    import("@/components/storefront/ProductViewer3D").then(
      (m) => m.ProductViewer3D
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] rounded-2xl bg-zinc-900 animate-pulse flex items-center justify-center">
        <span className="text-xs text-zinc-600">3D Model yükleniyor...</span>
      </div>
    ),
  }
);

interface Props {
  modelUrl: string;
  className?: string;
}

export function ProductViewer3DWrapper({ modelUrl, className }: Props) {
  return <ProductViewer3D modelUrl={modelUrl} className={className} />;
}
