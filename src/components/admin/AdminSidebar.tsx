"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  FileText,
  Image,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Building2,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/nfjmmn9wxzdf",             label: "Dashboard",       icon: LayoutDashboard },
  { href: "/nfjmmn9wxzdf/urunler",     label: "Ürünler",         icon: Package },
  { href: "/nfjmmn9wxzdf/projeler",    label: "Projeler",        icon: Building2 },
  { href: "/nfjmmn9wxzdf/kategoriler", label: "Kategoriler",     icon: FolderTree },
  { href: "/nfjmmn9wxzdf/icerik",      label: "İçerik Yönetimi", icon: FileText },
  { href: "/nfjmmn9wxzdf/medya",       label: "Medya",           icon: Image },
  { href: "/nfjmmn9wxzdf/ayarlar",     label: "Ayarlar",         icon: Settings },
];

interface AdminSidebarProps {
  /** Called when a nav link is clicked (mobile drawer close) */
  onClose?: () => void;
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = !!onClose; // mobile drawer mode when onClose is provided

  return (
    <aside
      className={cn(
        "h-full flex flex-col border-r border-border bg-card transition-all duration-300",
        // Desktop: sticky + fixed height; Mobile drawer: full height of parent
        isMobile ? "h-screen w-full" : (collapsed ? "w-16" : "w-64")
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
        {(!collapsed || isMobile) && (
          <Link
            href="/nfjmmn9wxzdf"
            className="text-lg font-bold text-gradient-gold"
            onClick={onClose}
          >
            URBAN MOBİLYA
          </Link>
        )}
        <button
          onClick={isMobile ? onClose : () => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground cursor-pointer ml-auto"
          aria-label={isMobile ? "Menüyü kapat" : (collapsed ? "Genişlet" : "Daralt")}
        >
          {isMobile ? (
            <X className="w-4 h-4" />
          ) : collapsed ? (
            <Menu className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/nfjmmn9wxzdf" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {(!collapsed || isMobile) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-border shrink-0">
        <button
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all cursor-pointer"
          onClick={async () => {
            await signOut({ callbackUrl: "/nfjmmn9wxzdf/login" });
          }}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {(!collapsed || isMobile) && <span>Çıkış Yap</span>}
        </button>
      </div>
    </aside>
  );
}
