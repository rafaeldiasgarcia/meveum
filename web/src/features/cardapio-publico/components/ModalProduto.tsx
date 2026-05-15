"use client";

import { useEffect, useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { listarGruposDoProduto } from "@/lib/api/cardapio-publico.api";
import { useCarrinho } from "../context/CarrinhoContext";
import { formatCurrency } from "@/lib/utils/format";
import type { ProdutoPublico, GrupoComplemento, ComplementoSelecionado } from "@/types/cardapio-publico";

type Props = {
  produto: ProdutoPublico;
  onFechar: () => void;
};

type SelecaoGrupo = Record<string, { opcaoId: string; nome: string; precoAdicional: number }[]>;

export function ModalProduto({ produto, onFechar }: Props) {
  const { adicionarItem } = useCarrinho();
  const [grupos, setGrupos] = useState<GrupoComplemento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [selecao, setSelecao] = useState<SelecaoGrupo>({});
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    listarGruposDoProduto(produto.id)
      .then(setGrupos)
      .finally(() => setCarregando(false));
  }, [produto.id]);

  function toggleOpcao(grupo: GrupoComplemento, opcaoId: string, nomeOpcao: string, preco: number) {
    setSelecao((prev) => {
      const atual = prev[grupo.grupoComplementoId] ?? [];
      const jaEsta = atual.some((o) => o.opcaoId === opcaoId);

      if (jaEsta) {
        return { ...prev, [grupo.grupoComplementoId]: atual.filter((o) => o.opcaoId !== opcaoId) };
      }

      if (grupo.quantidadeMaxima === 1) {
        return { ...prev, [grupo.grupoComplementoId]: [{ opcaoId, nome: nomeOpcao, precoAdicional: preco }] };
      }

      if (atual.length >= grupo.quantidadeMaxima) return prev;

      return {
        ...prev,
        [grupo.grupoComplementoId]: [...atual, { opcaoId, nome: nomeOpcao, precoAdicional: preco }],
      };
    });
  }

  function grupoSatisfeito(grupo: GrupoComplemento): boolean {
    const selecionados = selecao[grupo.grupoComplementoId]?.length ?? 0;
    return selecionados >= grupo.quantidadeMinima;
  }

  const podeConcluir = grupos.every(grupoSatisfeito);

  const totalComplementos = Object.values(selecao)
    .flat()
    .reduce((acc, o) => acc + o.precoAdicional, 0);

  const totalItem = (produto.preco + totalComplementos) * quantidade;

  function handleAdicionar() {
    const complementosSelecionados: ComplementoSelecionado[] = Object.entries(selecao).flatMap(
      ([grupoId, opcoes]) => {
        const grupo = grupos.find((g) => g.grupoComplementoId === grupoId);
        return opcoes.map((o) => ({
          opcaoComplementoId: o.opcaoId,
          nomeGrupo: grupo?.nomeGrupoComplemento ?? "",
          nomeOpcao: o.nome,
          precoAdicional: o.precoAdicional,
          quantidade: 1,
        }));
      }
    );

    adicionarItem({
      produtoId: produto.id,
      nomeProduto: produto.nome,
      precoBase: produto.preco,
      quantidade,
      complementosSelecionados,
      subtotal: totalItem,
    });

    onFechar();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onFechar} />
      <div
        className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden"
        data-testid="public-product-modal"
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3" />

        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 mt-1">
          <h2 className="font-bold text-gray-900 text-base">{produto.nome}</h2>
          <button onClick={onFechar} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-4 py-4 space-y-5">
          {produto.descricao && (
            <p className="text-sm text-gray-600 leading-relaxed">{produto.descricao}</p>
          )}

          {carregando ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            grupos.map((grupo) => {
              const selecionados = selecao[grupo.grupoComplementoId] ?? [];
              const obrigatorio = grupo.quantidadeMinima > 0;
              const satisfeito = grupoSatisfeito(grupo);

              return (
                <div key={grupo.id}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-bold text-gray-900 text-sm">
                        {grupo.nomeGrupoComplemento}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        {grupo.quantidadeMaxima === 1
                          ? "Escolha 1"
                          : `Até ${grupo.quantidadeMaxima}`}
                      </span>
                    </div>
                    {obrigatorio && (
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          satisfeito
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {satisfeito ? "OK" : "Obrigatório"}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {grupo.opcoes.map((opcao) => {
                      const selecionado = selecionados.some((o) => o.opcaoId === opcao.id);
                      return (
                        <label
                          key={opcao.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                            selecionado
                              ? "border-orange-400 bg-orange-50"
                              : "border-gray-300 hover:border-orange-300 hover:bg-orange-50"
                          }`}
                        >
                          <input
                            type={grupo.quantidadeMaxima === 1 ? "radio" : "checkbox"}
                            name={`grupo-${grupo.grupoComplementoId}`}
                            checked={selecionado}
                            onChange={() =>
                              toggleOpcao(grupo, opcao.id, opcao.nome, opcao.precoAdicional)
                            }
                            className="accent-orange-500 w-4 h-4"
                          />
                          <span className="flex-1 text-sm font-medium text-gray-900">{opcao.nome}</span>
                          {opcao.precoAdicional > 0 && (
                            <span className="text-sm font-semibold text-orange-600">
                              +{formatCurrency(opcao.precoAdicional)}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 py-4 border-t border-gray-200 space-y-3">
          <div className="flex items-center justify-center gap-5">
            <button
              onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-orange-400 hover:bg-orange-50 transition-colors"
            >
              <Minus className="w-4 h-4 text-gray-700" />
            </button>
            <span className="font-bold text-gray-900 text-lg w-6 text-center">{quantidade}</span>
            <button
              onClick={() => setQuantidade((q) => q + 1)}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-orange-400 hover:bg-orange-50 transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          <button
            onClick={handleAdicionar}
            disabled={!podeConcluir}
            className="w-full py-3.5 rounded-2xl bg-orange-500 text-white font-bold text-sm flex items-center justify-between px-4 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
            data-testid="public-product-add-button"
          >
            <span>Adicionar ao carrinho</span>
            <span>{formatCurrency(totalItem)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
