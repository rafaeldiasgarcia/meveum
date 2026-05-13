"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";
import type { ProdutoPublico } from "@/types/cardapio-publico";

type Props = {
  produto: ProdutoPublico;
  lojaAberta: boolean;
  onSelecionar: (produto: ProdutoPublico) => void;
};

export function CardProduto({ produto, lojaAberta, onSelecionar }: Props) {
  return (
    <button
      onClick={() => lojaAberta && onSelecionar(produto)}
      disabled={!lojaAberta}
      data-testid={`public-product-card-${produto.id}`}
      className="w-full text-left bg-white rounded-2xl shadow-sm flex gap-3 p-3 hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex-1 min-w-0 flex flex-col gap-1 py-1">
        <span
          className="font-semibold text-gray-900 text-sm leading-snug"
          data-testid={`public-product-name-${produto.id}`}
        >
          {produto.nome}
        </span>
        {produto.descricao && (
          <span className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {produto.descricao}
          </span>
        )}
        <span className="mt-auto pt-2 font-bold text-orange-500 text-sm">
          {formatCurrency(produto.preco)}
        </span>
      </div>

      <div className="relative shrink-0">
        {produto.imagemUrl ? (
          <Image
            src={produto.imagemUrl}
            alt={produto.nome}
            width={96}
            height={96}
            className="w-24 h-24 rounded-xl object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-xl bg-orange-50 flex items-center justify-center">
            <span className="text-3xl">🍽️</span>
          </div>
        )}
        {lojaAberta && (
          <div className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center shadow-md">
            <Plus className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </button>
  );
}
