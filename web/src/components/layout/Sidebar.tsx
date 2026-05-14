"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

type NavItem = {
  href: string;
  label: string;
  exact?: boolean;
  indent?: boolean;
};

type NavSection = {
  titulo: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    titulo: "Operação",
    items: [
      { href: "/dashboard", label: "Visão geral", exact: true },
      { href: "/dashboard/pedidos", label: "Pedidos" },
      { href: "/dashboard/cozinha", label: "Cozinha (KDS)" },
      { href: "/dashboard/mesas", label: "Mesas / QR" },
    ],
  },
  {
    titulo: "Cardápio",
    items: [
      { href: "/dashboard/cardapio", label: "Produtos", exact: true },
      { href: "/dashboard/cardapio/categorias", label: "Categorias", indent: true },
      { href: "/dashboard/cardapio/complementos", label: "Complementos", indent: true },
    ],
  },
  {
    titulo: "CRM",
    items: [
      { href: "/dashboard/clientes", label: "Clientes" },
      { href: "/dashboard/cupons", label: "Cupons" },
    ],
  },
  {
    titulo: "Integrações",
    items: [
      { href: "/dashboard/whatsapp", label: "WhatsApp" },
    ],
  },
  {
    titulo: "Financeiro",
    items: [
      { href: "/dashboard/financeiro", label: "Financeiro" },
      { href: "/dashboard/relatorios", label: "Relatórios" },
    ],
  },
  {
    titulo: "Configurações",
    items: [
      { href: "/dashboard/configuracoes", label: "Loja", exact: true },
      { href: "/dashboard/configuracoes/pagamentos", label: "Pagamentos", indent: true },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  function isActive(item: NavItem): boolean {
    return item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(item.href + "/");
  }

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

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 text-sm" aria-label="Navegação principal">
        {NAV_SECTIONS.map((section) => (
          <div key={section.titulo} className="mb-4">
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-[#FBF7F4]/30">
              {section.titulo}
            </p>
            {section.items.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-testid={`nav-${item.label.toLowerCase().replace(/[\s/()áàãâéêíóôõúç]/g, (c) => ({ " ": "-", "/": "-", "(": "", ")": "", "á": "a", "à": "a", "ã": "a", "â": "a", "é": "e", "ê": "e", "í": "i", "ó": "o", "ô": "o", "õ": "o", "ú": "u", "ç": "c" }[c] ?? c))}`}
                  className={cn(
                    "mb-0.5 flex items-center gap-2 rounded-md py-2 transition-colors",
                    item.indent ? "px-6" : "px-3",
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
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
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
