"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Truck, UtensilsCrossed, XCircle, Package } from "lucide-react";
import { buscarPedidoPublico, STATUS_LABEL, STATUS_DESC } from "@/lib/api/pedido-publico.api";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import type { PedidoPublico, StatusPedido } from "@/types";

const STATUS_ICON: Record<StatusPedido, React.ElementType> = {
  recebido: Clock,
  em_preparo: UtensilsCrossed,
  pronto: Package,
  saiu_entrega: Truck,
  finalizado: CheckCircle2,
  cancelado: XCircle,
};

const STATUS_COLOR: Record<StatusPedido, string> = {
  recebido: "text-blue-500 bg-blue-500/10",
  em_preparo: "text-amber-500 bg-amber-500/10",
  pronto: "text-purple-500 bg-purple-500/10",
  saiu_entrega: "text-[#EA580C] bg-[#EA580C]/10",
  finalizado: "text-green-500 bg-green-500/10",
  cancelado: "text-red-500 bg-red-500/10",
};

const ORDEM_STATUS: StatusPedido[] = ["recebido", "em_preparo", "saiu_entrega", "finalizado"];

export default function PedidoPublicoConteudo({ token }: { token: string }) {
  const [pedido, setPedido] = useState<PedidoPublico | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    buscarPedidoPublico(token)
      .then(setPedido)
      .catch((e: Error) => setErro(e.message || "Pedido não encontrado."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center py-16" data-testid="pedido-publico-loading">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#EA580C] border-t-transparent" />
      </div>
    );
  }

  if (erro || !pedido) {
    return (
      <div className="text-center space-y-3 py-16" data-testid="pedido-publico-error">
        <XCircle className="h-12 w-12 text-red-400 mx-auto" />
        <p className="font-semibold text-gray-800">Pedido não encontrado</p>
        <p className="text-sm text-gray-500">{erro ?? "Verifique o link e tente novamente."}</p>
      </div>
    );
  }

  const Icon = STATUS_ICON[pedido.status];
  const cor = STATUS_COLOR[pedido.status];
  const etapaAtual = ORDEM_STATUS.indexOf(pedido.status);

  return (
    <div className="w-full max-w-sm space-y-4" data-testid="pedido-publico-content">
      {/* Status principal */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center space-y-3 shadow-sm">
        <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${cor} mx-auto`}>
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Pedido #{pedido.numero}</p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">{STATUS_LABEL[pedido.status]}</p>
          <p className="text-sm text-gray-500 mt-1">{STATUS_DESC[pedido.status]}</p>
        </div>
      </div>

      {/* Linha do tempo */}
      {pedido.status !== "cancelado" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3" data-testid="pedido-publico-timeline">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Acompanhamento</p>
          <div className="space-y-2">
            {ORDEM_STATUS.map((s, i) => {
              const passou = i <= etapaAtual;
              const atual = i === etapaAtual;
              const StatusIcon = STATUS_ICON[s];
              return (
                <div key={s} className="flex items-center gap-3">
                  <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${passou ? "bg-[#EA580C] text-white" : "bg-gray-100 text-gray-300"}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                  </div>
                  <p className={`text-sm ${atual ? "font-semibold text-gray-900" : passou ? "text-gray-600" : "text-gray-300"}`}>
                    {STATUS_LABEL[s]}
                  </p>
                  {atual && <span className="ml-auto text-[10px] font-medium text-[#EA580C] bg-[#EA580C]/10 rounded-full px-2 py-0.5">Agora</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Histórico detalhado */}
      {pedido.historico.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-2" data-testid="pedido-publico-historico">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Histórico</p>
          {pedido.historico.map((h, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{STATUS_LABEL[h.status]}</span>
              <span className="text-gray-400 text-xs">{formatDateTime(h.ocorridoEm)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Itens do pedido */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-2" data-testid="pedido-publico-itens">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Itens</p>
        {pedido.itens.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-700">{item.quantidade}× {item.nomeProduto}</span>
            <span className="text-gray-500">{formatCurrency(item.subtotal)}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm font-bold border-t border-gray-100 pt-2 mt-2">
          <span className="text-gray-900">Total</span>
          <span className="text-[#EA580C]">{formatCurrency(pedido.total)}</span>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400">
        Pedido realizado em {formatDateTime(pedido.criadoEm)}
      </p>
    </div>
  );
}
