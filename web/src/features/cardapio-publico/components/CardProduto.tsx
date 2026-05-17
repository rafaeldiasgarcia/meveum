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

function imagemDoProduto(produto: ProdutoPublico): string {
  if (produto.imagemUrl) return produto.imagemUrl;

  const nome = produto.nome.toLowerCase();
  if (nome.includes("batata")) return "/cardapio-publico/batata-suprema.jpg";
  if (nome.includes("salada")) return "/cardapio-publico/salada-classico.jpg";
  if (nome.includes("chicken") || nome.includes("frango")) return "/cardapio-publico/chicken-crispy.jpg";
  if (nome.includes("refrigerante") || nome.includes("bebida")) return "/cardapio-publico/refrigerante-lata.jpg";
  return "/cardapio-publico/ze-smash-duplo.jpg";
}

export function CardProduto({ produto, lojaAberta, onSelecionar }: Props) {
  const imagem = imagemDoProduto(produto);

  return (
    <button
      type="button"
      onClick={() => lojaAberta && onSelecionar(produto)}
      disabled={!lojaAberta}
      data-testid={`public-product-card-${produto.id}`}
      className="flex w-full cursor-pointer gap-4 rounded-3xl border border-[#E8E0D6]/40 bg-[#FBF7F4] p-4 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all hover:border-[#EA580C]/20 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div>
          <h3
            className="text-base font-bold leading-tight text-[#1C1917]"
            data-testid={`public-product-name-${produto.id}`}
          >
            {produto.nome}
          </h3>
          {produto.descricao && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#78716C] md:line-clamp-3 md:text-sm">
              {produto.descricao}
            </p>
          )}
        </div>
        <span className="mt-3 text-base font-extrabold text-[#EA580C] md:text-lg">
          {formatCurrency(produto.preco)}
        </span>
      </div>

      <div className="group relative h-28 w-28 shrink-0 rounded-2xl bg-[#F0E8DA] md:h-[120px] md:w-[120px]">
        <div className="h-full w-full overflow-hidden rounded-2xl">
          <Image
            src={imagem}
            alt={produto.nome}
            width={128}
            height={128}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        {lojaAberta && (
          <span className="absolute -bottom-1 -right-1 z-20 flex h-9 w-9 items-center justify-center rounded-xl bg-[#EA580C] text-white shadow-lg transition-colors group-hover:bg-[#C2410C] md:h-10 md:w-10">
            <Plus className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.5} aria-hidden />
          </span>
        )}
      </div>
    </button>
  );
}
