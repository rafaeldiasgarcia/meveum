"use client";

import { LogOut } from "lucide-react";
import { useSessaoAutenticada } from "@/features/auth/context/SessaoAutenticadaContext";
import { toast } from "sonner";

function saudacao(nome: string) {
  const h = new Date().getHours();
  const prefix = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  return `${prefix}, ${nome.split(" ")[0]} 👋`;
}

export function Topbar() {
  const { usuario, sair } = useSessaoAutenticada();
  const nome = usuario?.nome ?? "usuário";

  return (
    <header
      className="flex shrink-0 items-center justify-between border-b border-[#E8E0D6] bg-[#FBF7F4] px-6 py-3"
      data-testid="topbar"
    >
      <div>
        <p className="text-xs text-[#78716C]">Operação · ao vivo</p>
        <h1
          className="text-xl font-semibold text-[#1C1917] leading-tight"
          data-testid="dashboard-greeting"
        >
          {saudacao(nome)}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Live indicator */}
        <div className="hidden items-center gap-2 rounded-md border border-[#E8E0D6] bg-white px-3 py-1.5 text-xs text-[#1C1917] md:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#EA580C]" />
          5 pedidos novos
        </div>

        {/* New order button */}
        <button
          type="button"
          onClick={() => toast.info("Novo pedido — em breve")}
          className="rounded-md bg-[#EA580C] px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-[#C2410C] transition-colors"
        >
          + Novo pedido
        </button>

        {/* Logout */}
        <button
          onClick={() => void sair()}
          title="Sair"
          data-testid="logout-button"
          className="flex h-8 w-8 items-center justify-center rounded-md text-[#78716C] hover:text-[#1C1917] hover:bg-black/5 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
