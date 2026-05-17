"use client";

import { toast } from "sonner";
import { useSessaoAutenticada } from "@/features/auth/context/SessaoAutenticadaContext";

function saudacao(nome: string) {
  const h = new Date().getHours();
  const prefix = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  return `${prefix}, ${nome} 👋`;
}

export function Topbar() {
  const { usuario } = useSessaoAutenticada();
  const nome = usuario?.nome ?? "Marina";

  return (
    <header
      className="flex shrink-0 items-center justify-between border-b border-[#E8E0D6] bg-[#FBF7F4] px-6 py-3"
      data-testid="topbar"
    >
      <div>
        <p className="text-sm text-[#57534E]">Operação · ao vivo</p>
        <h1
          className="text-2xl font-semibold leading-tight tracking-tight text-[#1C1917]"
          data-testid="dashboard-greeting"
        >
          {saudacao(nome)}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-[#E8E0D6] bg-white px-4 py-2 text-sm text-[#1C1917] shadow-sm md:flex">
          <span className="h-2 w-2 rounded-full bg-[#FDBA74]" />
          5 pedidos novos
        </div>

        <button
          type="button"
          onClick={() => toast.info("Novo pedido - em breve")}
          className="rounded-xl bg-[#EA580C] px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-[#C2410C]"
        >
          + Novo pedido
        </button>
      </div>
    </header>
  );
}
