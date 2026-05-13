"use client";

import { LogOut, Plus } from "lucide-react";
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
      className="flex items-center justify-between px-6 pt-5 pb-4 bg-[#F8F6F3] shrink-0"
      data-testid="topbar"
    >
      <div>
        <p className="text-xs text-[#A8A29E] font-medium mb-0.5">Operação · ao vivo</p>
        <h1
          className="text-2xl font-bold text-[#1C1917] leading-tight"
          data-testid="dashboard-greeting"
        >
          {saudacao(nome)}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EA580C] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EA580C]" />
          </span>
          <span className="text-sm text-[#78716C]">5 pedidos novos</span>
        </div>

        {/* New order button */}
        <button
          type="button"
          onClick={() => toast.info("Novo pedido — em breve")}
          className="flex items-center gap-1.5 rounded-lg bg-[#EA580C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#C2410C] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo pedido
        </button>

        {/* Logout */}
        <button
          onClick={() => void sair()}
          title="Sair"
          data-testid="logout-button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A8A29E] hover:text-[#1C1917] hover:bg-black/5 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
