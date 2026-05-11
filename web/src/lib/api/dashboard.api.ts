import type { MetricasDashboard, DadoGrafico } from "@/types";
import { mockMetricas, mockGraficoSemanal } from "@/lib/mocks/dashboard.mock";
import { mockPedidos } from "@/lib/mocks/pedidos.mock";
import type { Pedido } from "@/types";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export async function buscarMetricas(): Promise<MetricasDashboard> {
  await delay();
  return mockMetricas;
}

export async function buscarGraficoSemanal(): Promise<DadoGrafico[]> {
  await delay(300);
  return mockGraficoSemanal;
}

export async function buscarPedidosRecentes(): Promise<Pedido[]> {
  await delay(300);
  return [...mockPedidos]
    .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
    .slice(0, 5);
}
