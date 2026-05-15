"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useSessaoAutenticada } from "@/features/auth/context/SessaoAutenticadaContext";
import { cn } from "@/lib/utils/cn";

type NavItem = {
  href: string;
  label: string;
  exact?: boolean;
};

const NAV_ITEMS: NavItem[] = [
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

function slugTestId(label: string) {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function Sidebar() {
  const pathname = usePathname();
  const { sair } = useSessaoAutenticada();

  function isActive(item: NavItem): boolean {
    return item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(item.href + "/");
  }

  return (
    <aside
      className="hidden w-60 shrink-0 flex-col border-r border-white/10 bg-[#17100C] text-[#FBF7F4] md:flex"
      data-testid="sidebar"
    >
      <div className="flex items-center gap-3 border-b border-[#FBF7F4]/10 px-5 py-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#EA580C] text-base font-semibold text-white">
          M
        </span>
        <span className="text-xl font-semibold tracking-tight">MeVêUm</span>
      </div>

      <div className="px-5 pb-3 pt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#FBF7F4]/35">
          Burger do Bairro
        </p>
        <p className="mt-2 text-base font-semibold text-white">Av. Paulista · Aberto</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 text-base" aria-label="Navegação principal">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              data-testid={`nav-${slugTestId(item.label)}`}
              className={cn(
                "mb-1 flex items-center gap-2 rounded-xl px-3 py-2.5 font-medium transition-colors",
                active
                  ? "bg-[#EA580C]/18 text-[#EA580C]"
                  : "text-[#FBF7F4]/75 hover:bg-[#FBF7F4]/6 hover:text-white",
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 shrink-0 rounded-full",
                  active ? "bg-[#EA580C]" : "bg-[#FBF7F4]/35",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#FBF7F4]/10 p-4">
        <button
          type="button"
          onClick={() => void sair()}
          data-testid="logout-button"
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#FBF7F4]/65 transition-colors hover:bg-[#FBF7F4]/6 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
