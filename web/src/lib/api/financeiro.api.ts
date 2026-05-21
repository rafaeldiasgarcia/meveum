import type { RelatorioFinanceiro, PeriodoFinanceiro, DadoGrafico } from "@/types";
import { obterLojaId, requestAutenticada } from "@/lib/api/client";
import { listarPedidos } from "@/lib/api/pedidos.api";

function obterIntervalo(periodo: PeriodoFinanceiro): { inicio: Date; fim: Date } {
  const fim = new Date();
  const inicio = new Date();
  if (periodo === "hoje") {
    inicio.setHours(0, 0, 0, 0);
  } else if (periodo === "7dias") {
    inicio.setDate(inicio.getDate() - 6);
    inicio.setHours(0, 0, 0, 0);
  } else if (periodo === "30dias") {
    inicio.setDate(inicio.getDate() - 29);
    inicio.setHours(0, 0, 0, 0);
  } else {
    inicio.setDate(1);
    inicio.setHours(0, 0, 0, 0);
  }
  return { inicio, fim };
}

const LABEL_FORMA: Record<string, string> = {
  pix: "PIX",
  cartao_credito: "Crédito",
  cartao_debito: "Débito",
  dinheiro: "Dinheiro",
};

export async function buscarRelatorioFinanceiro(periodo: PeriodoFinanceiro): Promise<RelatorioFinanceiro> {
  try {
    const lojaId = obterLojaId();
    const { inicio, fim } = obterIntervalo(periodo);
    return await requestAutenticada<RelatorioFinanceiro>(
      `/financeiro/relatorio?lojaId=${lojaId}&inicio=${inicio.toISOString()}&fim=${fim.toISOString()}`,
      { method: "GET" },
    );
  } catch {
    return buildRelatorioFromPedidos(periodo);
  }
}

async function buildRelatorioFromPedidos(periodo: PeriodoFinanceiro): Promise<RelatorioFinanceiro> {
  const { inicio } = obterIntervalo(periodo);
  const pedidos = await listarPedidos().catch(() => []);
  const pedidosFiltrados = pedidos.filter((p) => new Date(p.criadoEm) >= inicio);
  const pagos = pedidosFiltrados.filter((p) => p.status !== "cancelado");
  const cancelados = pedidosFiltrados.filter((p) => p.status === "cancelado");

  const faturamentoTotal = pagos.reduce((acc, p) => acc + p.total, 0);
  const ticketMedio = pagos.length > 0 ? faturamentoTotal / pagos.length : 0;

  const porForma = new Map<string, number>();
  pagos.forEach((p) => {
    const atual = porForma.get(p.formaPagamento) ?? 0;
    porForma.set(p.formaPagamento, atual + p.total);
  });

  const porFormaPagamento = [...porForma.entries()].map(([forma, total]) => ({
    forma,
    label: LABEL_FORMA[forma] ?? forma,
    total,
    percentual: faturamentoTotal > 0 ? Math.round((total / faturamentoTotal) * 100) : 0,
  }));

  const grafico = buildGrafico(periodo, pedidosFiltrados.filter((p) => p.status !== "cancelado"));

  return { faturamentoTotal, pedidosPagos: pagos.length, pedidosCancelados: cancelados.length, ticketMedio, porFormaPagamento, grafico };
}

function buildGrafico(periodo: PeriodoFinanceiro, pedidos: Awaited<ReturnType<typeof listarPedidos>>): DadoGrafico[] {
  const dias = periodo === "hoje" ? 1 : periodo === "7dias" ? 7 : periodo === "30dias" ? 30 : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  return Array.from({ length: Math.min(dias, 30) }, (_, i) => {
    const dia = new Date();
    dia.setDate(dia.getDate() - (dias - 1 - i));
    dia.setHours(0, 0, 0, 0);
    const valor = pedidos
      .filter((p) => {
        const d = new Date(p.criadoEm);
        return d.getFullYear() === dia.getFullYear() && d.getMonth() === dia.getMonth() && d.getDate() === dia.getDate();
      })
      .reduce((acc, p) => acc + p.total, 0);
    const label = dia.toLocaleDateString("pt-BR", dias <= 7 ? { weekday: "short" } : { day: "2-digit", month: "2-digit" });
    return { label: label.replace(".", ""), valor };
  });
}
