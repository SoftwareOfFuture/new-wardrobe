"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
}

export function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar />
      </div>

      {/* ── Mobile: backdrop overlay ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile: slide-in drawer ── */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-[272px] transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onClose={() => setMobileOpen(false)} />
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Mobile top header */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 border-b border-border bg-card/95 backdrop-blur-md">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground cursor-pointer"
            aria-label="Menüyü aç"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/admin" className="text-base font-bold text-gradient-gold">
            URBAN MOBİLYA
          </Link>
        </div>

        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
