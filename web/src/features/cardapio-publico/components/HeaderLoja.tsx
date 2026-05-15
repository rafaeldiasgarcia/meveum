"use client";

import Image from "next/image";
import type { LojaPublica } from "@/types/cardapio-publico";

type Props = { loja: LojaPublica };

export function HeaderLoja({ loja }: Props) {
  return (
    <header
      className="mt-8 mb-2 flex flex-col items-center gap-3 px-4 text-center md:mt-12"
      data-testid="public-store-header"
    >
      <div className="relative">
        <Image
          src={loja.logoUrl ?? "/cardapio-publico/store-logo.jpg"}
          alt={loja.nome}
          width={112}
          height={112}
          className="h-24 w-24 rounded-full border-4 border-[#FBF7F4] object-cover shadow-xl md:h-28 md:w-28"
        />
        <span
          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
            loja.operacional
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
          data-testid="public-store-status"
        >
          {loja.operacional ? "ABERTO" : "FECHADO"}
        </span>
      </div>
      <div className="mt-1">
        <h1
          className="text-center text-2xl font-extrabold leading-tight text-[#1C1917] md:text-3xl"
          data-testid="public-store-name"
        >
          {loja.nome}
        </h1>
        <p className="mt-1 text-sm font-medium text-[#78716C] md:text-base">
          O melhor cardápio da região
        </p>
      </div>
    </header>
  );
}
