"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format";
import { useSessaoAutenticada } from "@/features/auth/context/SessaoAutenticadaContext";
import {
  buscarMetricas,
  buscarGraficoSemanal,
  buscarPedidosResumo,
  buscarKDSItems,
  buscarTopProdutos,
  buscarClientesRecorrentes,
} from "@/lib/api/dashboard.api";
import type {
  MetricasDashboard,
  DadoGrafico,
  PedidoResumo,
  KDSItem,
  TopProduto,
  ClienteRecorrente,
  StatusPedido,
} from "@/types";

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  StatusPedido,
  { label: string; className: string }
> = {
  recebido:     { label: "ACEITO",         className: "bg-gray-100 text-gray-600" },
  em_preparo:   { label: "EM PREPARO",     className: "bg-orange-100 text-orange-600" },
  pronto:       { label: "PRONTO",         className: "bg-green-100 text-green-700" },
  saiu_entrega: { label: "SAIU P/ ENTREGA",className: "bg-emerald-100 text-emerald-700" },
  finalizado:   { label: "CONCLUÍDO",      className: "bg-gray-100 text-gray-500" },
  cancelado:    { label: "CANCELADO",      className: "bg-red-100 text-red-500" },
};

function StatusBadge({ status, formaPagamento }: { status: StatusPedido; formaPagamento?: string }) {
  const isPagoPix = status === "finalizado" && formaPagamento === "pix";
  const cfg = isPagoPix
    ? { label: "PAGO PIX", className: "bg-blue-100 text-blue-600" }
    : STATUS_CONFIG[status];
  return (
    <span className={cn("rounded px-2 py-0.5 text-[10px] font-bold tracking-wide whitespace-nowrap", cfg.className)}>
      {cfg.label}
    </span>
  );
}

// ── KDS progress bar color ────────────────────────────────────────────────────
function kdsColor(min: number) {
  if (min <= 5) return { bar: "#EA580C", time: "text-orange-400" };
  if (min <= 10) return { bar: "#F59E0B", time: "text-amber-400" };
  return { bar: "#EF4444", time: "text-red-400" };
}

// ── Mini SVG area chart ────────────────────────────────────────────────────────
function GraficoArea({ dados }: { dados: DadoGrafico[] }) {
  if (dados.length < 2) return null;
  const W = 600, H = 80;
  const max = Math.max(...dados.map((d) => d.valor));
  const pts = dados.map((d, i) => ({
    x: (i / (dados.length - 1)) * W,
    y: H - (d.valor / max) * (H - 8) - 4,
    label: d.label,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H + 16}`} className="w-full" preserveAspectRatio="none" style={{ height: 80 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EA580C" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#areaGrad)" />
        <path d={line} fill="none" stroke="#EA580C" strokeWidth="1.5" />
        {pts.map((p) => (
          <circle key={p.label} cx={p.x} cy={p.y} r="3" fill="#EA580C" />
        ))}
      </svg>
      <div className="flex justify-between mt-1 px-0.5">
        {dados.map((d) => (
          <span key={d.label} className="text-[10px] text-[#A8A29E]">{d.label}</span>
        ))}
      </div>
    </div>
  );
}

// ── Metric card ───────────────────────────────────────────────────────────────
function MetricCard({
  label,
  value,
  variacao,
  variacaoLabel,
}: {
  label: string;
  value: string;
  variacao?: number;
  variacaoLabel?: string;
}) {
  const isPositive = (variacao ?? 0) >= 0;
  const varStr = variacao !== undefined
    ? `${isPositive ? "+" : ""}${variacaoLabel ?? `${variacao}%`}`
    : null;

  return (
    <div className="bg-white rounded-xl border border-[#EDE8E3] p-5 flex flex-col gap-3">
      <p className="text-[10px] font-semibold tracking-widest text-[#A8A29E] uppercase">{label}</p>
      <p className="text-2xl font-bold text-[#1C1917] leading-none">{value}</p>
      {varStr && (
        <p className={cn("text-xs font-medium", isPositive ? "text-green-600" : "text-red-500")}>
          {varStr}
          {variacaoLabel ? "" : " vs ontem"}
        </p>
      )}
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
type TabFiltro = "todos" | "recebido" | "em_preparo" | "saiu_entrega" | "finalizado";
const TABS: { id: TabFiltro; label: string }[] = [
  { id: "todos",        label: "Todos" },
  { id: "recebido",     label: "Novos" },
  { id: "em_preparo",   label: "Em preparo" },
  { id: "saiu_entrega", label: "Saiu" },
  { id: "finalizado",   label: "Concluídos" },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  useSessaoAutenticada();
  const [metricas, setMetricas] = useState<MetricasDashboard | null>(null);
  const [grafico, setGrafico] = useState<DadoGrafico[]>([]);
  const [pedidos, setPedidos] = useState<PedidoResumo[]>([]);
  const [kds, setKds] = useState<KDSItem[]>([]);
  const [top, setTop] = useState<TopProduto[]>([]);
  const [clientes, setClientes] = useState<ClienteRecorrente[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabFiltro>("todos");

  useEffect(() => {
    Promise.all([
      buscarMetricas(),
      buscarGraficoSemanal(),
      buscarPedidosResumo(),
      buscarKDSItems(),
      buscarTopProdutos(),
      buscarClientesRecorrentes(),
    ]).then(([m, g, p, k, t, c]) => {
      setMetricas(m);
      setGrafico(g);
      setPedidos(p);
      setKds(k);
      setTop(t);
      setClientes(c);
    }).finally(() => setLoading(false));
  }, []);

  const pedidosFiltrados = tab === "todos"
    ? pedidos
    : pedidos.filter((p) => p.status === tab);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#F8F6F3]" data-testid="dashboard-loading">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#EA580C] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Conteúdo principal ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-[#F8F6F3] px-6 pb-6 space-y-5">
        {/* Métricas */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard
            label="Faturamento hoje"
            value={formatCurrency(metricas?.faturamentoHoje ?? 0)}
            variacao={metricas?.variacaoFaturamentoPercent}
            variacaoLabel={`${metricas?.variacaoFaturamentoPercent ?? 0}% vs ontem`}
          />
          <MetricCard
            label="Pedidos hoje"
            value={String(metricas?.pedidosHoje ?? 0)}
            variacao={metricas?.variacaoPedidosPercent}
            variacaoLabel={`+${metricas?.variacaoPedidosPercent ?? 0}%`}
          />
          <MetricCard
            label="Ticket médio"
            value={formatCurrency(metricas?.ticketMedio ?? 0)}
            variacao={metricas?.variacaoTicketMedio}
            variacaoLabel={`+${formatCurrency(metricas?.variacaoTicketMedio ?? 0)}`}
          />
          <MetricCard
            label="Tempo médio cozinha"
            value={`${metricas?.tempoMedioCozinhaMin ?? 0} min`}
            variacao={metricas?.variacaoTempoMedioCozinha}
            variacaoLabel={`${metricas?.variacaoTempoMedioCozinha ?? 0} min`}
          />
        </div>

        {/* Pedidos recentes */}
        <div className="bg-white rounded-xl border border-[#EDE8E3]">
          {/* Header + tabs */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#F0EBE5]">
            <h2 className="text-sm font-semibold text-[#1C1917]">Pedidos recentes</h2>
            <div className="flex gap-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                    tab === t.id
                      ? "bg-[#1C1917] text-white"
                      : "text-[#78716C] hover:text-[#1C1917]"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="divide-y divide-[#F5F0EB]" data-testid="pedidos-recentes-list">
            {pedidosFiltrados.length === 0 ? (
              <p className="py-10 text-center text-sm text-[#A8A29E]">Nenhum pedido nesta categoria.</p>
            ) : (
              pedidosFiltrados.map((p) => (
                <div
                  key={p.id}
                  data-testid={`pedido-recente-${p.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAF7F4] transition-colors"
                >
                  <span className="text-xs text-[#A8A29E] font-mono w-12 shrink-0">#{p.numero}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1C1917] truncate">{p.descricao}</p>
                    <p className="text-xs text-[#A8A29E] truncate">{p.nomeCliente} · {p.local}</p>
                  </div>
                  <StatusBadge status={p.status} formaPagamento={p.formaPagamento} />
                  <span className="text-xs text-[#A8A29E] font-mono w-10 text-right shrink-0">{p.tempoStr}</span>
                  <span className="text-sm font-semibold text-[#1C1917] w-20 text-right shrink-0">
                    {formatCurrency(p.total)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Faturamento 7 dias */}
        <div className="bg-white rounded-xl border border-[#EDE8E3] p-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-[#A8A29E] uppercase">Faturamento · 7 dias</p>
              <p className="text-2xl font-bold text-[#1C1917] mt-1">
                {formatCurrency(metricas?.faturamento7Dias ?? 0)}
              </p>
            </div>
            <span className="text-sm font-semibold text-green-600">
              +{metricas?.variacaoFaturamento7Dias ?? 0}%
            </span>
          </div>
          <GraficoArea dados={grafico} />
        </div>
      </div>

      {/* ── Painel direito (KDS) ───────────────────────────────────────────── */}
      <div
        className="w-[340px] shrink-0 flex flex-col overflow-y-auto"
        style={{ background: "#1c1917" }}
      >
        {/* Cozinha KDS */}
        <div className="px-5 pt-5 pb-4 border-b border-white/8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Cozinha (KDS)</h2>
            <span className="rounded-full bg-[#EA580C] px-2 py-0.5 text-[10px] font-bold text-white">
              {kds.length} ATIVAS
            </span>
          </div>

          <div className="space-y-3">
            {kds.map((item) => {
              const { bar, time } = kdsColor(item.minutosEmPreparo);
              const pct = Math.min((item.minutosEmPreparo / 20) * 100, 100);
              return (
                <div key={item.id} className="rounded-lg bg-white/5 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-white/40 font-mono">#{item.numero}</span>
                    <span className={cn("text-xs font-bold", time)}>{item.minutosEmPreparo}min</span>
                  </div>
                  <p className="text-sm font-semibold text-white mb-2 truncate">{item.nomeProduto}</p>
                  <div className="h-1 w-full rounded-full bg-white/10">
                    <div
                      className="h-1 rounded-full transition-all"
                      style={{ width: `${pct}%`, background: bar }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top de hoje */}
        <div className="px-5 py-4 border-b border-white/8">
          <h2 className="text-sm font-semibold text-white mb-3">Top de hoje</h2>
          <div className="space-y-3">
            {top.map((item) => (
              <div key={item.posicao} className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-white/30 w-4 shrink-0">{item.posicao}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.nome}</p>
                  <p className="text-[11px] text-white/40">{item.unidades} un</p>
                </div>
                <span className="text-xs font-semibold text-white/70 shrink-0">
                  {formatCurrency(item.faturamento)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Clientes recorrentes */}
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold text-white mb-3">Clientes recorrentes</h2>
          <div className="space-y-3">
            {clientes.map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                {/* Avatar */}
                <div className="h-8 w-8 rounded-full bg-[#EA580C]/20 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-[#EA580C]">{c.iniciais}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{c.nome}</p>
                  <p className="text-[11px] text-white/40">
                    {c.totalPedidos} pedidos · {formatCurrency(c.totalGasto)}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded shrink-0",
                    c.badge === "VIP"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-white/8 text-white/50"
                  )}
                >
                  {c.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
