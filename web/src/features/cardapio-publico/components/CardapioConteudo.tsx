"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { CategoriaPublica, LojaPublica, ProdutoPublico } from "@/types/cardapio-publico";
import { CardProduto } from "./CardProduto";
import { DrawerCarrinho } from "./DrawerCarrinho";
import { ModalProduto } from "./ModalProduto";
import { NavCategorias } from "./NavCategorias";

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
        (produto) =>
          produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
          produto.descricao?.toLowerCase().includes(busca.toLowerCase()),
      )
    : null;

  return (
    <>
      <div className="relative mx-auto w-full max-w-2xl px-4 md:px-10 lg:px-14">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#78716C]" />
          <input
            type="search"
            placeholder="Buscar no cardápio..."
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            data-testid="public-menu-search-input"
            className="h-12 w-full rounded-2xl border-0 bg-[#FBF7F4] py-3 pl-12 pr-4 text-sm text-[#1C1917] shadow-sm ring-1 ring-black/5 transition-all placeholder:text-[#78716C] focus:outline-none focus:ring-2 focus:ring-[#EA580C] md:h-14 md:text-base"
          />
        </div>
      </div>

      {!produtosFiltrados && <NavCategorias categorias={categorias} />}

      <main className="flex-1 space-y-10 px-4 pb-32 md:px-10 lg:px-14">
        {produtosFiltrados ? (
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="public-search-results">
            {produtosFiltrados.length === 0 ? (
              <p className="col-span-full py-12 text-center text-sm text-[#78716C]" data-testid="public-search-empty">
                Nenhum produto encontrado para &quot;{busca}&quot;
              </p>
            ) : (
              produtosFiltrados.map((produto) => (
                <CardProduto
                  key={produto.id}
                  produto={produto}
                  lojaAberta={loja.operacional}
                  onSelecionar={setProdutoSelecionado}
                />
              ))
            )}
          </section>
        ) : (
          categorias.map((categoria) => {
            const itensDaCategoria = produtos.filter((produto) => produto.categoriaId === categoria.id);
            if (itensDaCategoria.length === 0) return null;

            return (
              <section
                key={categoria.id}
                id={`cat-${categoria.id}`}
                className="scroll-mt-24 md:scroll-mt-32"
                data-testid={`public-category-section-${categoria.id}`}
              >
                <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-[#1C1917] md:text-xl">
                  <span className="h-6 w-1.5 rounded-full bg-[#EA580C]" />
                  {categoria.nome}
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {itensDaCategoria.map((produto) => (
                    <CardProduto
                      key={produto.id}
                      produto={produto}
                      lojaAberta={loja.operacional}
                      onSelecionar={setProdutoSelecionado}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      {produtoSelecionado && (
        <ModalProduto
          produto={produtoSelecionado}
          onFechar={() => setProdutoSelecionado(null)}
        />
      )}

      <DrawerCarrinho lojaId={lojaId} loja={loja} />
    </>
  );
}
