"use client";

import { Package, Eye, Box, FolderTree } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  className?: string;
}

function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-5 space-y-3 transition-all hover:glow-gold-subtle",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        <div className="p-2 rounded-lg bg-primary/10">{icon}</div>
      </div>
      <div>
        <p className="text-3xl font-bold">{value}</p>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">{trend}</p>
        )}
      </div>
    </div>
  );
}

interface DashboardStatsProps {
  stats: {
    totalProducts: number;
    publishedProducts: number;
    totalCategories: number;
    total3DModels: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Toplam Ürün"
        value={stats.totalProducts}
        icon={<Package className="w-4 h-4 text-primary" />}
      />
      <StatCard
        title="Yayında"
        value={stats.publishedProducts}
        icon={<Eye className="w-4 h-4 text-primary" />}
        trend={`${stats.totalProducts > 0 ? Math.round((stats.publishedProducts / stats.totalProducts) * 100) : 0}% yayında`}
      />
      <StatCard
        title="Kategoriler"
        value={stats.totalCategories}
        icon={<FolderTree className="w-4 h-4 text-primary" />}
      />
      <StatCard
        title="3D Modeller"
        value={stats.total3DModels}
        icon={<Box className="w-4 h-4 text-primary" />}
      />
    </div>
  );
}
