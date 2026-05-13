"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Logo } from "@/components/shared/Logo";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Operação", exact: true },
  { href: "/dashboard/pedidos", label: "Pedidos" },
  { href: "/dashboard/cozinha", label: "Cozinha (KDS)" },
  { href: "/dashboard/cardapio", label: "Cardápio" },
  { href: "/dashboard/mesas", label: "Mesas / QR" },
  { href: "/dashboard/clientes", label: "Clientes" },
  { href: "/dashboard/cupons", label: "Cupons" },
  { href: "/dashboard/whatsapp", label: "WhatsApp" },
  { href: "/dashboard/financeiro", label: "Financeiro" },
  { href: "/dashboard/relatorios", label: "Relatórios" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex w-48 flex-col h-screen sticky top-0 shrink-0"
      style={{ background: "#1c1917" }}
      data-testid="sidebar"
    >
      {/* Logo */}
      <div className="px-4 pt-5 pb-4">
        <Logo size="sm" />
      </div>

      {/* Restaurant info */}
      <div className="px-4 pb-4 border-b border-white/8">
        <p className="text-[10px] font-semibold tracking-widest text-white/35 uppercase mb-0.5">
          Burger do Bairro
        </p>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />
          <span className="text-xs text-white/50 truncate">Av. Paulista · Aberto</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ href, label, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              data-testid={`nav-${label.toLowerCase().replace(/[\s/()]/g, "-")}`}
              className={cn(
                "flex items-center gap-2.5 pl-4 pr-3 py-2 text-sm transition-colors border-l-2",
                active
                  ? "border-[#EA580C] text-white bg-white/5"
                  : "border-transparent text-white/45 hover:text-white/80 hover:bg-white/4"
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full shrink-0",
                  active ? "bg-[#EA580C]" : "bg-white/25"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
