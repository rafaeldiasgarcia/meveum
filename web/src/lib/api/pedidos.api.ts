import type { Pedido, StatusPedido } from "@/types";
import { mockPedidos } from "@/lib/mocks/pedidos.mock";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

let pedidos = [...mockPedidos];

export async function listarPedidos(): Promise<Pedido[]> {
  await delay();
  return [...pedidos].sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
}

export async function buscarPedido(id: string): Promise<Pedido | undefined> {
  await delay(200);
  return pedidos.find((p) => p.id === id);
}

export async function atualizarStatusPedido(id: string, status: StatusPedido): Promise<Pedido> {
  await delay(500);
  pedidos = pedidos.map((p) =>
    p.id === id ? { ...p, status, atualizadoEm: new Date().toISOString() } : p
  );
  return pedidos.find((p) => p.id === id)!;
}
