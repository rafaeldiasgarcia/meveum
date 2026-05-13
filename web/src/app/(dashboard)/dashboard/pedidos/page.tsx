"use client";

import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusPedidoBadge } from "@/components/shared/StatusPedidoBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { listarPedidos, atualizarStatusPedido } from "@/lib/api/pedidos.api";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import type { Pedido, StatusPedido } from "@/types";

const TODOS_STATUS: { value: StatusPedido | "todos"; label: string }[] = [
  { value: "todos", label: "Todos os pedidos" },
  { value: "recebido", label: "Recebido" },
  { value: "em_preparo", label: "Em preparo" },
  { value: "pronto", label: "Pronto" },
  { value: "saiu_entrega", label: "Saiu p/ entrega" },
  { value: "finalizado", label: "Finalizado" },
  { value: "cancelado", label: "Cancelado" },
];

const PROXIMOS_STATUS: Record<StatusPedido, StatusPedido | null> = {
  recebido: "em_preparo",
  em_preparo: "pronto",
  pronto: "saiu_entrega",
  saiu_entrega: "finalizado",
  finalizado: null,
  cancelado: null,
};

const LABEL_PROXIMO: Partial<Record<StatusPedido, string>> = {
  recebido: "Aceitar e iniciar preparo",
  em_preparo: "Marcar como pronto",
  pronto: "Saiu para entrega",
  saiu_entrega: "Finalizar pedido",
};

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<StatusPedido | "todos">("todos");
  const [detalhe, setDetalhe] = useState<Pedido | null>(null);

  async function carregar() {
    setLoading(true);
    const data = await listarPedidos();
    setPedidos(data);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  const pedidosFiltrados = filtroStatus === "todos"
    ? pedidos
    : pedidos.filter((p) => p.status === filtroStatus);

  async function avancarStatus(pedido: Pedido) {
    const proximo = PROXIMOS_STATUS[pedido.status];
    if (!proximo) return;
    const atualizado = await atualizarStatusPedido(pedido.id, proximo);
    setPedidos((prev) => prev.map((p) => (p.id === pedido.id ? atualizado : p)));
    if (detalhe?.id === pedido.id) setDetalhe(atualizado);
    toast.success("Status atualizado!");
  }

  async function cancelar(pedido: Pedido) {
    const atualizado = await atualizarStatusPedido(pedido.id, "cancelado");
    setPedidos((prev) => prev.map((p) => (p.id === pedido.id ? atualizado : p)));
    if (detalhe?.id === pedido.id) setDetalhe(atualizado);
    toast.success("Pedido cancelado");
  }

  return (
    <div className="p-6 overflow-y-auto h-full space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-foreground)]">Pedidos</h1>
          <p className="text-sm text-[var(--color-muted)]">{pedidos.length} pedidos no sistema</p>
        </div>
        <Select
          value={filtroStatus}
          onValueChange={(v) => setFiltroStatus(v as StatusPedido | "todos")}
        >
          <SelectTrigger className="w-48" data-testid="pedido-status-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TODOS_STATUS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Lista */}
        <div>
          {loading ? (
            <div className="flex justify-center py-16" data-testid="pedidos-loading">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-orange)] border-t-transparent" />
            </div>
          ) : pedidosFiltrados.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              titulo="Nenhum pedido encontrado"
              descricao={filtroStatus !== "todos" ? "Tente remover o filtro de status." : "Os pedidos aparecerão aqui."}
              data-testid="pedidos-empty-state"
            />
          ) : (
            <div className="space-y-2" data-testid="pedidos-list">
              {pedidosFiltrados.map((pedido) => (
                <button
                  key={pedido.id}
                  onClick={() => setDetalhe(detalhe?.id === pedido.id ? null : pedido)}
                  className={`w-full text-left rounded-[var(--radius-lg)] border transition-colors p-4 ${
                    detalhe?.id === pedido.id
                      ? "border-[var(--color-orange)]/40 bg-[var(--color-orange-dim)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)]"
                  }`}
                  data-testid={`pedido-card-${pedido.id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--color-muted)]">#{pedido.numero}</span>
                      <span className="font-semibold text-sm text-[var(--color-foreground)]">{pedido.nomeCliente}</span>
                    </div>
                    <StatusPedidoBadge status={pedido.status} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
                    <span>{pedido.itens.length} {pedido.itens.length === 1 ? "item" : "itens"} · {pedido.tipo === "delivery" ? "Entrega" : "Retirada"}</span>
                    <span className="font-semibold text-[var(--color-foreground)]">{formatCurrency(pedido.total)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detalhe */}
        {detalhe && (
          <Card data-testid="pedido-detalhe">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-[var(--color-foreground)]">Pedido #{detalhe.numero}</p>
                  <p className="text-xs text-[var(--color-muted)]">{formatDateTime(detalhe.criadoEm)}</p>
                </div>
                <StatusPedidoBadge status={detalhe.status} />
              </div>

              <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-2)] border border-[var(--color-border)] p-3 space-y-1">
                <p className="text-xs font-semibold text-[var(--color-muted)] uppercase">Cliente</p>
                <p className="text-sm font-medium text-[var(--color-foreground)]">{detalhe.nomeCliente}</p>
                <p className="text-xs text-[var(--color-muted)]">{detalhe.telefoneCliente}</p>
                {detalhe.tipo === "delivery" && detalhe.enderecoEntrega && (
                  <p className="text-xs text-[var(--color-muted)]">{detalhe.enderecoEntrega} — {detalhe.bairroEntrega}</p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-[var(--color-muted)] uppercase mb-2">Itens</p>
                <div className="space-y-1.5" data-testid="pedido-itens">
                  {detalhe.itens.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-[var(--color-foreground)]">{item.quantidade}× {item.nomeProduto}</span>
                      <span className="text-[var(--color-muted)]">{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                  {detalhe.taxaEntrega && (
                    <div className="flex justify-between text-sm border-t border-[var(--color-border)] pt-1.5 mt-1.5">
                      <span className="text-[var(--color-muted)]">Taxa de entrega</span>
                      <span className="text-[var(--color-muted)]">{formatCurrency(detalhe.taxaEntrega)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold border-t border-[var(--color-border)] pt-1.5 mt-1.5">
                    <span className="text-[var(--color-foreground)]">Total</span>
                    <span className="text-[var(--color-orange)]">{formatCurrency(detalhe.total)}</span>
                  </div>
                </div>
              </div>

              {detalhe.observacao && (
                <div className="rounded-[var(--radius-md)] bg-amber-500/10 border border-amber-500/20 p-3">
                  <p className="text-xs font-semibold text-amber-400 uppercase mb-1">Observação</p>
                  <p className="text-sm text-[var(--color-foreground)]">{detalhe.observacao}</p>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                {PROXIMOS_STATUS[detalhe.status] && (
                  <button
                    onClick={() => avancarStatus(detalhe)}
                    className="flex-1 rounded-[var(--radius-md)] bg-[var(--color-orange)] text-white text-sm font-semibold py-2.5 hover:bg-[var(--color-orange-hover)] transition-colors"
                    data-testid="pedido-avancar-status-button"
                  >
                    {LABEL_PROXIMO[detalhe.status]}
                  </button>
                )}
                {detalhe.status !== "cancelado" && detalhe.status !== "finalizado" && (
                  <button
                    onClick={() => cancelar(detalhe)}
                    className="rounded-[var(--radius-md)] border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-medium px-4 py-2.5 hover:bg-red-500/20 transition-colors"
                    data-testid="pedido-cancelar-button"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
