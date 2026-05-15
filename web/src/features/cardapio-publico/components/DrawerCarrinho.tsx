"use client";

import { useState } from "react";
import { ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";
import { useCarrinho } from "../context/CarrinhoContext";
import { formatCurrency } from "@/lib/utils/format";
import type { LojaPublica } from "@/types/cardapio-publico";
import { CheckoutDrawer } from "./CheckoutDrawer";

type Props = { lojaId: string; loja: LojaPublica };

export function DrawerCarrinho({ lojaId, loja }: Props) {
  const { itens, total, quantidadeTotal, alterarQuantidade, removerItem } = useCarrinho();
  const [aberto, setAberto] = useState(false);
  const [checkoutAberto, setCheckoutAberto] = useState(false);

  if (quantidadeTotal === 0 && !aberto && !checkoutAberto) return null;

  return (
    <>
      {quantidadeTotal > 0 && !aberto && (
        <button
          onClick={() => setAberto(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#1C1917] text-white rounded-2xl px-4 py-3.5 shadow-xl flex items-center gap-3 hover:bg-[#292524] transition-colors max-w-sm w-[calc(100%-2rem)]"
          data-testid="public-cart-open-button"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-white" />
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {quantidadeTotal}
            </span>
          </div>
          <span className="flex-1 text-left font-semibold text-sm">Ver sacola</span>
          <span className="font-bold text-sm">{formatCurrency(total)}</span>
        </button>
      )}

      {aberto && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAberto(false)} />
          <div
            className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden"
            data-testid="public-cart-drawer"
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3" />

            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 mt-1">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-500" />
                <h2 className="font-semibold text-gray-900">Seu pedido</h2>
              </div>
              <button onClick={() => setAberto(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-4 py-3 space-y-3">
              {itens.map((item) => (
                <div key={item.uid} className="flex gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{item.nomeProduto}</p>
                    {item.complementosSelecionados.length > 0 && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                        {item.complementosSelecionados.map((c) => c.nomeOpcao).join(", ")}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-orange-500 mt-1">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => removerItem(item.uid)}
                      className="p-1 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          item.quantidade === 1
                            ? removerItem(item.uid)
                            : alterarQuantidade(item.uid, item.quantidade - 1)
                        }
                        className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-orange-400 hover:bg-orange-50 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5 text-gray-700" />
                      </button>
                      <span className="text-sm font-bold text-gray-900 w-5 text-center">{item.quantidade}</span>
                      <button
                        onClick={() => alterarQuantidade(item.uid, item.quantidade + 1)}
                        className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-orange-400 hover:bg-orange-50 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-gray-700" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-4 border-t border-gray-100 space-y-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="font-medium text-gray-800">{formatCurrency(total)}</span>
              </div>
              <p className="text-xs text-gray-400">Taxa de entrega calculada no checkout</p>
              <button
                onClick={() => { setAberto(false); setCheckoutAberto(true); }}
                className="w-full py-3.5 rounded-2xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors"
                data-testid="public-cart-checkout-button"
              >
                Fechar pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {checkoutAberto && (
        <CheckoutDrawer
          lojaId={lojaId}
          loja={loja}
          onFechar={() => setCheckoutAberto(false)}
          onVoltarCarrinho={() => { setCheckoutAberto(false); setAberto(true); }}
        />
      )}
    </>
  );
}
