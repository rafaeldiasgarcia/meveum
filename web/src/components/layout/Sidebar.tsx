"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, UtensilsCrossed, ClipboardList,
  Users, Settings, ChevronRight, Zap,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard },
  { href: "/dashboard/pedidos", label: "Pedidos", icon: ClipboardList, badge: 4 },
  { href: "/dashboard/cardapio", label: "Cardápio", icon: UtensilsCrossed },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex w-60 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] h-screen sticky top-0"
      data-testid="sidebar"
    >
      <div className="p-5 border-b border-[var(--color-border)]">
        <Logo size="sm" showTag />
      </div>

      <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              data-testid={`nav-${label.toLowerCase().replace(/\s/g, "-")}`}
              className={cn(
                "group flex items-center justify-between rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-[var(--color-orange-dim)] text-[var(--color-orange)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-2)]"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </div>
              <div className="flex items-center gap-1">
                {badge && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-orange)] text-[10px] font-bold text-white">
                    {badge}
                  </span>
                )}
                {active && <ChevronRight className="h-3 w-3 opacity-60" />}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--color-border)]">
        <div className="rounded-[var(--radius-md)] bg-[var(--color-orange-dim)] border border-[var(--color-orange)]/20 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-[var(--color-orange)]" />
            <span className="text-xs font-semibold text-[var(--color-orange)]">Plano Gratuito</span>
          </div>
          <p className="text-xs text-[var(--color-muted)]">50 pedidos/mês. Faça upgrade para ilimitado.</p>
          <button className="mt-2 w-full rounded text-xs font-semibold bg-[var(--color-orange)] text-white py-1.5 hover:bg-[var(--color-orange-hover)] transition-colors">
            Fazer upgrade
          </button>
        </div>
      </div>
    </aside>
  );
}
