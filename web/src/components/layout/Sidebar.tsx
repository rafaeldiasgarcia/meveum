"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

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
      className="hidden w-60 shrink-0 flex-col border-r border-white/10 bg-[#1C1917] text-[#FBF7F4] md:flex"
      data-testid="sidebar"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-[#FBF7F4]/10 px-5 py-4">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-[#EA580C] text-sm font-bold text-white">
          M
        </span>
        <span className="text-lg font-semibold">MeVêUm</span>
      </div>

      {/* Restaurant info */}
      <div className="px-5 py-4">
        <p className="text-[10px] uppercase tracking-wider text-[#FBF7F4]/40">Burger do Bairro</p>
        <p className="text-sm font-semibold">Av. Paulista · Aberto</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 text-sm" aria-label="Navegação principal">
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
                "mb-1 flex items-center gap-2 rounded-md px-3 py-2 transition-colors",
                active
                  ? "bg-[#EA580C]/15 text-[#EA580C] font-semibold"
                  : "text-[#FBF7F4]/70 hover:bg-[#FBF7F4]/5",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 shrink-0 rounded-full",
                  active ? "bg-[#EA580C]" : "bg-[#FBF7F4]/30",
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#FBF7F4]/10 p-4">
        <Link href="/" className="text-xs text-[#FBF7F4]/60 hover:text-[#FBF7F4] transition-colors">
          ← voltar para o site
        </Link>
      </div>
    </aside>
  );
}
