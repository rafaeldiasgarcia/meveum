"use client";

import { useEffect, useState } from "react";
import { BarChart2, Users, Repeat, TrendingUp, Clock } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/shared/MetricCard";
import { buscarRelatorioOperacional } from "@/lib/api/relatorios.api";
import { formatCurrency } from "@/lib/utils/format";
import type { RelatorioOperacional, PeriodoRelatorio } from "@/types";

const PERIODOS: { value: PeriodoRelatorio; label: string }[] = [
  { value: "7dias", label: "7 dias" },
  { value: "30dias", label: "30 dias" },
  { value: "90dias", label: "90 dias" },
];

function GraficoBarras({ dados, altura = 112 }: { dados: { label: string; valor: number }[]; altura?: number }) {
  const max = Math.max(...dados.map((d) => d.valor), 1);
  return (
    <div className="flex items-end gap-1" style={{ height: altura }} data-testid="relatorios-grafico-vendas">
      {dados.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-0">
          <div
            className="w-full rounded-t bg-[var(--color-orange)] transition-all"
            style={{ height: `${Math.max((d.valor / max) * 100, d.valor > 0 ? 4 : 0)}%` }}
            title={formatCurrency(d.valor)}
          />
          <span className="text-[9px] text-[var(--color-muted)] truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function GraficoHorarios({ dados }: { dados: { hora: string; pedidos: number }[] }) {
  const max = Math.max(...dados.map((d) => d.pedidos), 1);
  const horariosFiltrados = dados.filter((_, i) => i >= 8 && i <= 23);
  return (
    <div className="flex items-end gap-0.5 h-20" data-testid="relatorios-grafico-horarios">
      {horariosFiltrados.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5 flex-1 min-w-0">
          <div
            className="w-full rounded-t bg-[var(--color-orange)]/70 transition-all"
            style={{ height: `${Math.max((d.pedidos / max) * 100, d.pedidos > 0 ? 4 : 0)}%` }}
            title={`${d.hora}: ${d.pedidos} pedidos`}
          />
          {i % 4 === 0 && <span className="text-[8px] text-[var(--color-muted)]">{d.hora.slice(0, 2)}h</span>}
        </div>
      ))}
    </div>
  );
}

export default function RelatoriosPage() {
  const [relatorio, setRelatorio] = useState<RelatorioOperacional | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<PeriodoRelatorio>("30dias");

  async function carregar(p: PeriodoRelatorio) {
    setLoading(true);
    try {
      setRelatorio(await buscarRelatorioOperacional(p));
    } catch {
      toast.error("Não foi possível carregar os relatórios.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void carregar(periodo); }, [periodo]);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-foreground)]">Relatórios</h1>
          <p className="text-sm text-[var(--color-muted)]">Produtos, horários e clientes</p>
        </div>
        <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden" data-testid="relatorios-periodo-filtro">
          {PERIODOS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPeriodo(value)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                periodo === value
                  ? "bg-[var(--color-orange)] text-white"
                  : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              }`}
              data-testid={`relatorios-periodo-${value}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16" data-testid="relatorios-loading">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-orange)] border-t-transparent" />
        </div>
      ) : !relatorio ? (
        <p className="text-center text-[var(--color-muted)] py-12" data-testid="relatorios-error">Nenhum dado disponível.</p>
      ) : (
        <div className="space-y-5" data-testid="relatorios-content">
          {/* Clientes */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <MetricCard label="Total de clientes" value={String(relatorio.totalClientes)} icon={Users} data-testid="relatorios-total-clientes-card" />
            <MetricCard label="Novos" value={String(relatorio.clientesNovos)} icon={TrendingUp} data-testid="relatorios-novos-card" />
            <MetricCard label="Recorrentes" value={String(relatorio.clientesRecorrentes)} icon={Repeat} data-testid="relatorios-recorrentes-card" />
          </div>

          {/* Vendas por dia */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-[var(--color-muted)]" />
                Vendas por dia
              </CardTitle>
            </CardHeader>
            <CardContent>
              {relatorio.vendasPorDia.every((d) => d.valor === 0) ? (
                <p className="text-center text-sm text-[var(--color-muted)] py-6" data-testid="relatorios-vendas-vazio">Nenhuma venda no período.</p>
              ) : (
                <GraficoBarras dados={relatorio.vendasPorDia} />
              )}
            </CardContent>
          </Card>

          {/* Top produtos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Produtos mais vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              {relatorio.topProdutos.length === 0 ? (
                <p className="text-sm text-[var(--color-muted)]" data-testid="relatorios-produtos-vazio">Nenhum produto vendido no período.</p>
              ) : (
                <div className="space-y-2" data-testid="relatorios-produtos-list">
                  {relatorio.topProdutos.map((p) => (
                    <div key={p.posicao} className="flex items-center gap-3" data-testid={`relatorios-produto-${p.posicao}`}>
                      <span className="w-5 text-xs font-bold text-[var(--color-muted)] text-right">{p.posicao}º</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--color-foreground)] truncate">{p.nome}</p>
                        <p className="text-xs text-[var(--color-muted)]">{p.unidades} unidades</p>
                      </div>
                      <span className="text-sm font-semibold text-[var(--color-orange)] shrink-0">{formatCurrency(p.faturamento)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Horários de pico */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-[var(--color-muted)]" />
                Horários de pico
              </CardTitle>
            </CardHeader>
            <CardContent>
              {relatorio.horariosPico.every((h) => h.pedidos === 0) ? (
                <p className="text-sm text-[var(--color-muted)]" data-testid="relatorios-horarios-vazio">Nenhum pedido no período.</p>
              ) : (
                <GraficoHorarios dados={relatorio.horariosPico} />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
