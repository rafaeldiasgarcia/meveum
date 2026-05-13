"use client";

import Image from "next/image";
import type { LojaPublica } from "@/types/cardapio-publico";

type Props = { loja: LojaPublica };

export function HeaderLoja({ loja }: Props) {
  return (
    <header
      className="pt-10 pb-6 flex flex-col items-center gap-2 bg-[#FFF8F4]"
      data-testid="public-store-header"
    >
      <div className="relative">
        {loja.logoUrl ? (
          <Image
            src={loja.logoUrl}
            alt={loja.nome}
            width={88}
            height={88}
            className="w-[88px] h-[88px] rounded-full object-cover border-4 border-white shadow-lg"
          />
        ) : (
          <div className="w-[88px] h-[88px] rounded-full bg-orange-100 flex items-center justify-center border-4 border-white shadow-lg">
            <span className="text-orange-600 font-bold text-3xl">
              {loja.nome.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span
          className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm ${
            loja.operacional
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
          data-testid="public-store-status"
        >
          {loja.operacional ? "ABERTO" : "FECHADO"}
        </span>
      </div>
      <h1
        className="mt-4 font-bold text-gray-900 text-2xl text-center leading-tight"
        data-testid="public-store-name"
      >
        {loja.nome}
      </h1>
    </header>
  );
}
