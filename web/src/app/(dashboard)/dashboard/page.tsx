"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag, DollarSign, Receipt, Flame,
  Users, RefreshCw, UtensilsCrossed, ClipboardList, ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatusPedidoBadge } from "@/components/shared/StatusPedidoBadge";
import { GraficoVendas } from "@/features/dashboard/components/GraficoVendas";
import { buscarMetricas, buscarGraficoSemanal, buscarPedidosRecentes } from "@/lib/api/dashboard.api";
import { formatCurrency, formatTime } from "@/lib/utils/format";
import type { MetricasDashboard, DadoGrafico, Pedido } from "@/types";

export default function DashboardPage() {
  const [metricas, setMetricas] = useState<MetricasDashboard | null>(null);
  const [grafico, setGrafico] = useState<DadoGrafico[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([buscarMetricas(), buscarGraficoSemanal(), buscarPedidosRecentes()])
      .then(([m, g, p]) => { setMetricas(m); setGrafico(g); setPedidos(p); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" data-testid="dashboard-loading">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-orange)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-foreground)]">Bom dia, Bryan 👋</h1>
          <p className="text-sm text-[var(--color-muted)]">Aqui está um resumo do que está acontecendo hoje.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            <span className="text-xs font-medium text-green-400">Loja aberta</span>
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2 md:col-span-1 lg:col-span-2">
          <MetricCard
            label="Pedidos hoje"
            value={String(metricas?.pedidosHoje ?? 0)}
            icon={ShoppingBag}
            variacao={metricas?.variacaoPedidos}
            data-testid="metric-card-orders-today"
          />
        </div>
        <div className="col-span-2 md:col-span-1 lg:col-span-2">
          <MetricCard
            label="Faturamento hoje"
            value={formatCurrency(metricas?.faturamentoHoje ?? 0)}
            icon={DollarSign}
            variacao={metricas?.variacaoFaturamento}
            destaque
            data-testid="metric-card-revenue"
          />
        </div>
        <MetricCard
          label="Ticket médio"
          value={formatCurrency(metricas?.ticketMedio ?? 0)}
          icon={Receipt}
          data-testid="metric-card-ticket"
        />
        <MetricCard
          label="Em preparo"
          value={String(metricas?.pedidosEmPreparo ?? 0)}
          icon={Flame}
          descricao="pedidos na cozinha"
          data-testid="metric-card-preparing"
        />
        <MetricCard
          label="Novos clientes"
          value={String(metricas?.novosClientesHoje ?? 0)}
          icon={Users}
          descricao="hoje"
          data-testid="metric-card-new-clients"
        />
        <MetricCard
          label="Recompra"
          value={`${metricas?.taxaRecompra ?? 0}%`}
          icon={RefreshCw}
          descricao="clientes que voltaram"
          data-testid="metric-card-repurchase"
        />
      </div>

      {/* Gráfico + Pedidos recentes */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Gráfico */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Vendas dos últimos 7 dias</CardTitle>
              <span className="text-xs text-[var(--color-muted)]">
                Total: {formatCurrency(grafico.reduce((a, d) => a + d.valor, 0))}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <GraficoVendas dados={grafico} />
          </CardContent>
        </Card>

        {/* Atalhos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Atalhos rápidos</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {[
              { href: "/dashboard/pedidos", icon: ClipboardList, label: "Ver pedidos" },
              { href: "/dashboard/cardapio", icon: UtensilsCrossed, label: "Cardápio" },
              { href: "/dashboard/clientes", icon: Users, label: "Clientes" },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 hover:border-[var(--color-orange)]/30 transition-colors text-center"
                data-testid={`shortcut-${label.toLowerCase().replace(/\s/g, "-")}`}
              >
                <Icon className="h-5 w-5 text-[var(--color-muted)]" />
                <span className="text-xs font-medium text-[var(--color-foreground)]">{label}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pedidos recentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Pedidos recentes</CardTitle>
            <Link href="/dashboard/pedidos">
              <Button variant="ghost" size="sm" className="gap-1 text-xs" data-testid="ver-todos-pedidos-button">
                Ver todos <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {pedidos.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--color-muted)]" data-testid="pedidos-empty">
              Nenhum pedido ainda hoje.
            </p>
          ) : (
            <div className="space-y-2" data-testid="pedidos-recentes-list">
              {pedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3"
                  data-testid={`pedido-recente-${pedido.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-muted)]">
                      #{pedido.numero}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-foreground)]">{pedido.nomeCliente}</p>
                      <p className="text-xs text-[var(--color-muted)]">
                        {pedido.itens.length} {pedido.itens.length === 1 ? "item" : "itens"} · {formatTime(pedido.criadoEm)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPedidoBadge status={pedido.status} />
                    <span className="text-sm font-semibold text-[var(--color-foreground)]">
                      {formatCurrency(pedido.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
