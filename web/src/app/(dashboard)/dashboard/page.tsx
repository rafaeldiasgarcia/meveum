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

// ── Status badges (fiel ao HTML do designer) ─────────────────────────────────
const STATUS_CONFIG: Record<StatusPedido, { label: string; className: string }> = {
  recebido:     { label: "Aceito",          className: "bg-[#EA580C]/15 text-[#EA580C]" },
  em_preparo:   { label: "Em preparo",      className: "bg-[#EA580C]/15 text-[#EA580C]" },
  pronto:       { label: "Pronto",          className: "bg-[#25D366]/15 text-[oklch(0.45_0.13_150)]" },
  saiu_entrega: { label: "Saiu p/ entrega", className: "bg-[#25D366]/15 text-[oklch(0.45_0.13_150)]" },
  finalizado:   { label: "Concluído",       className: "bg-[#78716C]/10 text-[#78716C]" },
  cancelado:    { label: "Cancelado",       className: "bg-red-100 text-red-600" },
};

function StatusBadge({
  status,
  formaPagamento,
}: {
  status: StatusPedido;
  formaPagamento?: string;
}) {
  const isPagoPix = status === "finalizado" && formaPagamento === "pix";
  const cfg = isPagoPix
    ? { label: "Pago PIX", className: "bg-[#F59E0B]/25 text-[oklch(0.45_0.12_70)]" }
    : STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase",
        cfg.className,
      )}
    >
      {cfg.label}
    </span>
  );
}

// ── SVG area chart ────────────────────────────────────────────────────────────
function GraficoArea({ dados }: { dados: DadoGrafico[] }) {
  if (dados.length < 2) return null;
  const W = 600;
  const H = 180;
  const max = Math.max(...dados.map((d) => d.valor));
  const pts = dados.map((d, i) => ({
    x: (i / (dados.length - 1)) * W,
    y: H - 10 - (d.valor / max) * (H - 30),
    label: d.label,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  const color = "oklch(0.68 0.185 45)";

  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full">
        <defs>
          <linearGradient id="dg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#dg)" />
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
        {pts.map((p) => (
          <circle key={p.label} cx={p.x} cy={p.y} r="3" fill={color} />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-[#78716C]">
        {dados.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </>
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
    ])
      .then(([m, g, p, k, t, c]) => {
        setMetricas(m);
        setGrafico(g);
        setPedidos(p);
        setKds(k);
        setTop(t);
        setClientes(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const pedidosFiltrados =
    tab === "todos" ? pedidos : pedidos.filter((p) => p.status === tab);

  if (loading) {
    return (
      <div
        className="flex min-h-[50vh] items-center justify-center"
        data-testid="dashboard-loading"
      >
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#EA580C] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">

      {/* ── Métricas ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-[#E8E0D6] bg-white p-5 shadow-soft">
          <p className="text-[10px] uppercase tracking-wider text-[#78716C]">Faturamento hoje</p>
          <p className="mt-2 text-2xl font-semibold text-[#1C1917]">
            {formatCurrency(metricas?.faturamentoHoje ?? 0)}
          </p>
          <p className="mt-1 text-xs font-medium text-[#EA580C]">
            +{metricas?.variacaoFaturamentoPercent ?? 0}% vs ontem
          </p>
        </div>
        <div className="rounded-xl border border-[#E8E0D6] bg-white p-5 shadow-soft">
          <p className="text-[10px] uppercase tracking-wider text-[#78716C]">Pedidos hoje</p>
          <p className="mt-2 text-2xl font-semibold text-[#1C1917]">
            {metricas?.pedidosHoje ?? 0}
          </p>
          <p className="mt-1 text-xs font-medium text-[#EA580C]">
            +{metricas?.variacaoPedidosPercent ?? 0}%
          </p>
        </div>
        <div className="rounded-xl border border-[#E8E0D6] bg-white p-5 shadow-soft">
          <p className="text-[10px] uppercase tracking-wider text-[#78716C]">Ticket médio</p>
          <p className="mt-2 text-2xl font-semibold text-[#1C1917]">
            {formatCurrency(metricas?.ticketMedio ?? 0)}
          </p>
          <p className="mt-1 text-xs font-medium text-[#EA580C]">
            +{formatCurrency(metricas?.variacaoTicketMedio ?? 0)}
          </p>
        </div>
        <div className="rounded-xl border border-[#E8E0D6] bg-white p-5 shadow-soft">
          <p className="text-[10px] uppercase tracking-wider text-[#78716C]">Tempo médio cozinha</p>
          <p className="mt-2 text-2xl font-semibold text-[#1C1917]">
            {metricas?.tempoMedioCozinhaMin ?? 0} min
          </p>
          <p className="mt-1 text-xs font-medium text-[#25D366]">
            {metricas?.variacaoTempoMedioCozinha ?? 0} min
          </p>
        </div>
      </div>

      {/* ── Pedidos + KDS + Top ─────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Pedidos recentes — 2/3 */}
        <section
          className="rounded-xl border border-[#E8E0D6] bg-white shadow-soft lg:col-span-2"
        >
          <header className="flex items-center justify-between border-b border-[#E8E0D6] px-5 py-3">
            <p className="font-semibold text-[#1C1917]">Pedidos recentes</p>
            <div className="flex gap-1 text-xs">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "rounded-md px-2.5 py-1 transition-colors",
                    tab === t.id
                      ? "bg-[#1C1917] text-white"
                      : "text-[#1C1917]/70 hover:bg-[#F5EFE8]",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </header>
          <ul className="divide-y divide-[#F5F0EB]" data-testid="pedidos-recentes-list">
            {pedidosFiltrados.length === 0 ? (
              <li className="py-10 text-center text-sm text-[#78716C]">
                Nenhum pedido nesta categoria.
              </li>
            ) : (
              pedidosFiltrados.map((p) => (
                <li
                  key={p.id}
                  className="grid grid-cols-12 items-center gap-3 px-5 py-3"
                  data-testid={`pedido-recente-${p.id}`}
                >
                  <span className="col-span-2 font-mono text-xs text-[#78716C]">
                    #{p.numero}
                  </span>
                  <div className="col-span-5 min-w-0">
                    <p className="truncate text-sm font-medium text-[#1C1917]">{p.descricao}</p>
                    <p className="text-xs text-[#78716C]">
                      {p.nomeCliente} · {p.local}
                    </p>
                  </div>
                  <span className="col-span-2 justify-self-start">
                    <StatusBadge status={p.status} formaPagamento={p.formaPagamento} />
                  </span>
                  <span className="col-span-1 text-center font-mono text-xs text-[#78716C]">
                    {p.tempoStr}
                  </span>
                  <span className="col-span-2 text-right text-sm font-semibold text-[#1C1917]">
                    {formatCurrency(p.total)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        {/* Coluna direita — KDS + Top */}
        <div className="space-y-4">
          {/* Cozinha KDS */}
          <section className="rounded-xl border border-[#E8E0D6] bg-[#1C1917] p-5 text-[#FBF7F4] shadow-soft">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Cozinha (KDS)</p>
              <span className="rounded-full bg-[#EA580C]/20 px-2 py-0.5 text-[10px] font-bold uppercase text-[#EA580C]">
                {kds.length} ativas
              </span>
            </div>
            <ul className="mt-4 space-y-3">
              {kds.map((item) => {
                const overdue = item.minutosEmPreparo > 10;
                const pct = Math.min((item.minutosEmPreparo / 12.5) * 100, 100);
                return (
                  <li key={item.id} className="rounded-lg bg-[#292524] p-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#FBF7F4]/50">#{item.numero}</span>
                      <span
                        className={cn(
                          overdue ? "font-semibold text-[#EA580C]" : "text-[#FBF7F4]/60",
                        )}
                      >
                        {item.minutosEmPreparo}min
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{item.nomeProduto}</p>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#FBF7F4]/10">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: overdue ? "#EA580C" : "#F59E0B",
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Top de hoje */}
          <section className="rounded-xl border border-[#E8E0D6] bg-white p-5 shadow-soft">
            <p className="font-semibold text-[#1C1917]">Top de hoje</p>
            <ul className="mt-3 space-y-3 text-sm">
              {top.map((item) => (
                <li key={item.posicao} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-[#EA580C]/[0.12] font-mono text-xs text-[#EA580C]">
                    {item.posicao}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#1C1917]">{item.nome}</p>
                    <p className="text-xs text-[#78716C]">{item.unidades} un</p>
                  </div>
                  <span className="text-sm font-semibold text-[#1C1917]">
                    {formatCurrency(item.faturamento)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* ── Gráfico + Clientes ───────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Faturamento 7 dias — 2/3 */}
        <section className="rounded-xl border border-[#E8E0D6] bg-white p-5 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#78716C]">
                Faturamento · 7 dias
              </p>
              <p className="text-2xl font-semibold text-[#1C1917]">
                {formatCurrency(metricas?.faturamento7Dias ?? 0)}
              </p>
            </div>
            <span className="rounded-full bg-[#EA580C]/[0.12] px-2.5 py-1 text-xs font-semibold text-[#EA580C]">
              +{metricas?.variacaoFaturamento7Dias ?? 0}%
            </span>
          </div>
          <GraficoArea dados={grafico} />
        </section>

        {/* Clientes recorrentes — 1/3 */}
        <section className="rounded-xl border border-[#E8E0D6] bg-white p-5 shadow-soft">
          <p className="font-semibold text-[#1C1917]">Clientes recorrentes</p>
          <ul className="mt-3 space-y-3">
            {clientes.map((c) => (
              <li key={c.id} className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#EA580C]/15 text-xs font-semibold text-[#EA580C]">
                  {c.iniciais}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#1C1917]">{c.nome}</p>
                  <p className="text-xs text-[#78716C]">
                    {c.totalPedidos} pedidos · {formatCurrency(c.totalGasto)}
                  </p>
                </div>
                <span className="rounded-full bg-[#F0EBE3] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#1C1917]/70">
                  {c.badge === "VIP" ? "VIP" : "Recorrente"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

    </div>
  );
}
