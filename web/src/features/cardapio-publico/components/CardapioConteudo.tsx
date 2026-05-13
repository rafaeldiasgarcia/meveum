"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { CategoriaPublica, LojaPublica, ProdutoPublico } from "@/types/cardapio-publico";
import { CardProduto } from "./CardProduto";
import { ModalProduto } from "./ModalProduto";
import { DrawerCarrinho } from "./DrawerCarrinho";

type Props = {
  lojaId: string;
  loja: LojaPublica;
  categorias: CategoriaPublica[];
  produtos: ProdutoPublico[];
};

export function CardapioConteudo({ lojaId, loja, categorias, produtos }: Props) {
  const [busca, setBusca] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoPublico | null>(null);

  const produtosFiltrados = busca.trim()
    ? produtos.filter(
        (p) =>
          p.nome.toLowerCase().includes(busca.toLowerCase()) ||
          p.descricao?.toLowerCase().includes(busca.toLowerCase())
      )
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 pb-32">
      <div className="py-3 sticky top-[52px] z-10 bg-[#FFF8F4]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Buscar no cardápio..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            data-testid="public-menu-search-input"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      {produtosFiltrados ? (
        <section className="mt-2 flex flex-col gap-2" data-testid="public-search-results">
          {produtosFiltrados.length === 0 ? (
            <p className="text-center text-gray-400 py-12 text-sm" data-testid="public-search-empty">
              Nenhum produto encontrado para &quot;{busca}&quot;
            </p>
          ) : (
            produtosFiltrados.map((p) => (
              <CardProduto
                key={p.id}
                produto={p}
                lojaAberta={loja.operacional}
                onSelecionar={setProdutoSelecionado}
              />
            ))
          )}
        </section>
      ) : (
        categorias.map((cat) => {
          const itensDaCategoria = produtos.filter((p) => p.categoriaId === cat.id);
          if (itensDaCategoria.length === 0) return null;
          return (
            <section
              key={cat.id}
              id={`cat-${cat.id}`}
              className="mt-6"
              data-testid={`public-category-section-${cat.id}`}
            >
              <h2 className="font-bold text-gray-900 text-base mb-3 pl-3 border-l-4 border-orange-500">
                {cat.nome}
              </h2>
              <div className="flex flex-col gap-2">
                {itensDaCategoria.map((p) => (
                  <CardProduto
                    key={p.id}
                    produto={p}
                    lojaAberta={loja.operacional}
                    onSelecionar={setProdutoSelecionado}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}

      {produtoSelecionado && (
        <ModalProduto
          produto={produtoSelecionado}
          onFechar={() => setProdutoSelecionado(null)}
        />
      )}

      <DrawerCarrinho lojaId={lojaId} loja={loja} />
    </div>
  );
}
