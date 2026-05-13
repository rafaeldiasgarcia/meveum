import type {
  MetricasDashboard,
  DadoGrafico,
  KDSItem,
  TopProduto,
  ClienteRecorrente,
  PedidoResumo,
} from "@/types";
import {
  mockMetricas,
  mockGraficoSemanal,
  mockKDSItems,
  mockTopProdutos,
  mockClientesRecorrentes,
  mockPedidosResumo,
} from "@/lib/mocks/dashboard.mock";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export async function buscarMetricas(): Promise<MetricasDashboard> {
  await delay();
  return mockMetricas;
}

export async function buscarGraficoSemanal(): Promise<DadoGrafico[]> {
  await delay(300);
  return mockGraficoSemanal;
}

export async function buscarPedidosResumo(): Promise<PedidoResumo[]> {
  await delay(300);
  return mockPedidosResumo;
}

export async function buscarKDSItems(): Promise<KDSItem[]> {
  await delay(200);
  return mockKDSItems;
}

export async function buscarTopProdutos(): Promise<TopProduto[]> {
  await delay(200);
  return mockTopProdutos;
}

export async function buscarClientesRecorrentes(): Promise<ClienteRecorrente[]> {
  await delay(200);
  return mockClientesRecorrentes;
}
