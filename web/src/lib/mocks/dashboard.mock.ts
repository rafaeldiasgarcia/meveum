import type { MetricasDashboard, DadoGrafico } from "@/types";

export const mockMetricas: MetricasDashboard = {
  pedidosHoje: 23,
  faturamentoHoje: 1847.5,
  ticketMedio: 80.32,
  pedidosEmPreparo: 4,
  novosClientesHoje: 3,
  taxaRecompra: 68,
  variacaoPedidos: +12,
  variacaoFaturamento: +8.4,
};

export const mockGraficoSemanal: DadoGrafico[] = [
  { label: "Seg", valor: 1240 },
  { label: "Ter", valor: 980 },
  { label: "Qua", valor: 1560 },
  { label: "Qui", valor: 1320 },
  { label: "Sex", valor: 2100 },
  { label: "Sáb", valor: 2840 },
  { label: "Dom", valor: 1847 },
];
