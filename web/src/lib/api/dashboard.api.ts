import type { MetricasDashboard, DadoGrafico, Pedido } from "@/types";
import { obterLojaId, requestAutenticada } from "@/lib/api/client";
import { listarPedidos } from "@/lib/api/pedidos.api";

type ResumoDashboardApi = {
  faturamentoTotal: number;
  quantidadePedidos: number;
  ticketMedio: number;
  pedidosNovos: number;
  pedidosEmPreparo: number;
};

function periodoHoje() {
  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);
  const fim = new Date();
  fim.setHours(23, 59, 59, 999);
  return { inicio: inicio.toISOString(), fim: fim.toISOString() };
}

function periodoUltimosDias(dias: number) {
  const inicio = new Date();
  inicio.setDate(inicio.getDate() - dias + 1);
  inicio.setHours(0, 0, 0, 0);
  const fim = new Date();
  fim.setHours(23, 59, 59, 999);
  return { inicio: inicio.toISOString(), fim: fim.toISOString() };
}

export async function buscarMetricas(): Promise<MetricasDashboard> {
  const lojaId = obterLojaId();
  const { inicio, fim } = periodoHoje();
  const resumo = await requestAutenticada<ResumoDashboardApi>(
    `/dashboard/resumo?lojaId=${lojaId}&inicio=${encodeURIComponent(inicio)}&fim=${encodeURIComponent(fim)}`,
    { method: "GET" }
  );

  return {
    pedidosHoje: Number(resumo.quantidadePedidos),
    faturamentoHoje: Number(resumo.faturamentoTotal),
    ticketMedio: Number(resumo.ticketMedio),
    pedidosEmPreparo: Number(resumo.pedidosEmPreparo),
    novosClientesHoje: 0,
    taxaRecompra: 0,
    variacaoPedidos: 0,
    variacaoFaturamento: 0,
  };
}

export async function buscarGraficoSemanal(): Promise<DadoGrafico[]> {
  const pedidos = await listarPedidos();
  const dias = Array.from({ length: 7 }, (_, index) => {
    const data = new Date();
    data.setDate(data.getDate() - (6 - index));
    data.setHours(0, 0, 0, 0);
    return data;
  });

  return dias.map((dia) => {
    const total = pedidos
      .filter((pedido) => mesmoDia(new Date(pedido.criadoEm), dia))
      .reduce((acc, pedido) => acc + pedido.total, 0);

    return {
      label: dia.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
      valor: total,
    };
  });
}

export async function buscarPedidosRecentes(): Promise<Pedido[]> {
  return (await listarPedidos()).slice(0, 5);
}

function mesmoDia(data: Date, referencia: Date) {
  return data.getFullYear() === referencia.getFullYear()
    && data.getMonth() === referencia.getMonth()
    && data.getDate() === referencia.getDate();
}

export async function buscarResumoUltimosDias(): Promise<ResumoDashboardApi> {
  const lojaId = obterLojaId();
  const { inicio, fim } = periodoUltimosDias(7);
  return requestAutenticada<ResumoDashboardApi>(
    `/dashboard/resumo?lojaId=${lojaId}&inicio=${encodeURIComponent(inicio)}&fim=${encodeURIComponent(fim)}`,
    { method: "GET" }
  );
}
