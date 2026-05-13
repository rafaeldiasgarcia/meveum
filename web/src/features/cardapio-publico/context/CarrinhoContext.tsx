"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { ItemCarrinho, ComplementoSelecionado } from "@/types/cardapio-publico";

type Estado = {
  itens: ItemCarrinho[];
  total: number;
  quantidadeTotal: number;
};

type Acao =
  | { type: "ADICIONAR"; item: Omit<ItemCarrinho, "uid"> }
  | { type: "REMOVER"; uid: string }
  | { type: "ALTERAR_QUANTIDADE"; uid: string; quantidade: number }
  | { type: "LIMPAR" };

function calcularSubtotal(
  precoBase: number,
  complementos: ComplementoSelecionado[],
  quantidade: number
): number {
  const totalComplementos = complementos.reduce(
    (acc, c) => acc + c.precoAdicional * c.quantidade,
    0
  );
  return (precoBase + totalComplementos) * quantidade;
}

function calcularTotais(itens: ItemCarrinho[]): Pick<Estado, "total" | "quantidadeTotal"> {
  return {
    total: itens.reduce((acc, i) => acc + i.subtotal, 0),
    quantidadeTotal: itens.reduce((acc, i) => acc + i.quantidade, 0),
  };
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
    case "ADICIONAR": {
      const uid = `${acao.item.produtoId}-${Date.now()}`;
      const subtotal = calcularSubtotal(
        acao.item.precoBase,
        acao.item.complementosSelecionados,
        acao.item.quantidade
      );
      const novoItem: ItemCarrinho = { ...acao.item, uid, subtotal };
      const itens = [...estado.itens, novoItem];
      return { itens, ...calcularTotais(itens) };
    }
    case "REMOVER": {
      const itens = estado.itens.filter((i) => i.uid !== acao.uid);
      return { itens, ...calcularTotais(itens) };
    }
    case "ALTERAR_QUANTIDADE": {
      const itens = estado.itens.map((i) => {
        if (i.uid !== acao.uid) return i;
        const subtotal = calcularSubtotal(
          i.precoBase,
          i.complementosSelecionados,
          acao.quantidade
        );
        return { ...i, quantidade: acao.quantidade, subtotal };
      });
      return { itens, ...calcularTotais(itens) };
    }
    case "LIMPAR":
      return { itens: [], total: 0, quantidadeTotal: 0 };
    default:
      return estado;
  }
}

const estadoInicial: Estado = { itens: [], total: 0, quantidadeTotal: 0 };

type CarrinhoContextType = Estado & {
  adicionarItem: (item: Omit<ItemCarrinho, "uid">) => void;
  removerItem: (uid: string) => void;
  alterarQuantidade: (uid: string, quantidade: number) => void;
  limpar: () => void;
};

const CarrinhoContext = createContext<CarrinhoContextType | null>(null);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(reducer, estadoInicial);

  return (
    <CarrinhoContext.Provider
      value={{
        ...estado,
        adicionarItem: (item) => dispatch({ type: "ADICIONAR", item }),
        removerItem: (uid) => dispatch({ type: "REMOVER", uid }),
        alterarQuantidade: (uid, quantidade) =>
          dispatch({ type: "ALTERAR_QUANTIDADE", uid, quantidade }),
        limpar: () => dispatch({ type: "LIMPAR" }),
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho(): CarrinhoContextType {
  const ctx = useContext(CarrinhoContext);
  if (!ctx) throw new Error("useCarrinho deve ser usado dentro de CarrinhoProvider");
  return ctx;
}
