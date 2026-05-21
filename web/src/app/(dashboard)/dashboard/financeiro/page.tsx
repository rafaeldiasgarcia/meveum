"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, ShoppingBag, XCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/shared/MetricCard";
import { buscarRelatorioFinanceiro } from "@/lib/api/financeiro.api";
import { formatCurrency } from "@/lib/utils/format";
import type { RelatorioFinanceiro, PeriodoFinanceiro } from "@/types";

const PERIODOS: { value: PeriodoFinanceiro; label: string }[] = [
  { value: "hoje", label: "Hoje" },
  { value: "7dias", label: "7 dias" },
  { value: "30dias", label: "30 dias" },
  { value: "mes", label: "Este mês" },
];

function GraficoBarras({ dados }: { dados: { label: string; valor: number }[] }) {
  const max = Math.max(...dados.map((d) => d.valor), 1);
  return (
    <div className="flex items-end gap-1 h-28" data-testid="financeiro-grafico">
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

function exportarCSV(relatorio: RelatorioFinanceiro) {
  const linhas = [
    ["Forma de Pagamento", "Total", "Percentual"],
    ...relatorio.porFormaPagamento.map((f) => [f.label, formatCurrency(f.total), `${f.percentual}%`]),
    [],
    ["Faturamento Total", formatCurrency(relatorio.faturamentoTotal)],
    ["Pedidos Pagos", String(relatorio.pedidosPagos)],
    ["Pedidos Cancelados", String(relatorio.pedidosCancelados)],
    ["Ticket Médio", formatCurrency(relatorio.ticketMedio)],
  ];
  const csv = linhas.map((l) => l.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "financeiro.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function FinanceiroPage() {
  const [relatorio, setRelatorio] = useState<RelatorioFinanceiro | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<PeriodoFinanceiro>("7dias");

  async function carregar(p: PeriodoFinanceiro) {
    setLoading(true);
    try {
      setRelatorio(await buscarRelatorioFinanceiro(p));
    } catch {
      toast.error("Não foi possível carregar os dados financeiros.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void carregar(periodo); }, [periodo]);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-foreground)]">Financeiro</h1>
          <p className="text-sm text-[var(--color-muted)]">Receita, pedidos e formas de pagamento</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden" data-testid="financeiro-periodo-filtro">
            {PERIODOS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setPeriodo(value)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  periodo === value
                    ? "bg-[var(--color-orange)] text-white"
                    : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                }`}
                data-testid={`financeiro-periodo-${value}`}
              >
                {label}
              </button>
            ))}
          </div>
          {relatorio && (
            <Button variant="secondary" size="sm" onClick={() => exportarCSV(relatorio)} data-testid="financeiro-exportar-button">
              <Download className="h-3.5 w-3.5" /> Exportar
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16" data-testid="financeiro-loading">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-orange)] border-t-transparent" />
        </div>
      ) : !relatorio ? (
        <p className="text-center text-[var(--color-muted)] py-12" data-testid="financeiro-error">Nenhum dado disponível.</p>
      ) : (
        <div className="space-y-5" data-testid="financeiro-content">
          {/* Métricas */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricCard
              label="Faturamento"
              value={formatCurrency(relatorio.faturamentoTotal)}
              icon={DollarSign}
              data-testid="financeiro-faturamento-card"
            />
            <MetricCard
              label="Pedidos pagos"
              value={String(relatorio.pedidosPagos)}
              icon={ShoppingBag}
              data-testid="financeiro-pedidos-card"
            />
            <MetricCard
              label="Ticket médio"
              value={formatCurrency(relatorio.ticketMedio)}
              icon={TrendingUp}
              data-testid="financeiro-ticket-card"
            />
            <MetricCard
              label="Cancelados"
              value={String(relatorio.pedidosCancelados)}
              icon={XCircle}
              data-testid="financeiro-cancelados-card"
            />
          </div>

          {/* Gráfico */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Faturamento por dia</CardTitle>
            </CardHeader>
            <CardContent>
              {relatorio.grafico.every((d) => d.valor === 0) ? (
                <p className="text-center text-sm text-[var(--color-muted)] py-8" data-testid="financeiro-grafico-vazio">
                  Nenhuma venda no período selecionado.
                </p>
              ) : (
                <GraficoBarras dados={relatorio.grafico} />
              )}
            </CardContent>
          </Card>

          {/* Formas de pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Por forma de pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              {relatorio.porFormaPagamento.length === 0 ? (
                <p className="text-sm text-[var(--color-muted)]" data-testid="financeiro-formas-vazio">Nenhum dado disponível.</p>
              ) : (
                <div className="space-y-3" data-testid="financeiro-formas-list">
                  {relatorio.porFormaPagamento.map((item) => (
                    <div key={item.forma} data-testid={`financeiro-forma-${item.forma}`}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-[var(--color-foreground)]">{item.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[var(--color-muted)]">{item.percentual}%</span>
                          <span className="font-semibold text-[var(--color-foreground)]">{formatCurrency(item.total)}</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-[var(--color-border)]">
                        <div
                          className="h-1.5 rounded-full bg-[var(--color-orange)] transition-all"
                          style={{ width: `${item.percentual}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
