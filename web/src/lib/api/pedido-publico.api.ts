import type { PedidoPublico, StatusPedido } from "@/types";
import { request } from "@/lib/api/client";

const MOCK_PEDIDO: PedidoPublico = {
  token: "demo",
  numero: 42,
  nomeCliente: "João Silva",
  status: "em_preparo",
  tipo: "delivery",
  itens: [
    { nomeProduto: "Smash Clássico", quantidade: 2, subtotal: 36 },
    { nomeProduto: "Batata Frita G", quantidade: 1, subtotal: 14 },
  ],
  total: 50,
  historico: [
    { status: "recebido", ocorridoEm: new Date(Date.now() - 20 * 60000).toISOString() },
    { status: "em_preparo", ocorridoEm: new Date(Date.now() - 10 * 60000).toISOString() },
  ],
  criadoEm: new Date(Date.now() - 20 * 60000).toISOString(),
};

export async function buscarPedidoPublico(token: string): Promise<PedidoPublico> {
  try {
    return await request<PedidoPublico>(`/pedidos/publico/${token}`, { method: "GET" });
  } catch {
    if (token === "demo") return MOCK_PEDIDO;
    throw new Error("Pedido não encontrado.");
  }
}

export const STATUS_LABEL: Record<StatusPedido, string> = {
  recebido: "Pedido recebido",
  em_preparo: "Em preparo",
  pronto: "Pronto para retirada",
  saiu_entrega: "Saiu para entrega",
  finalizado: "Entregue",
  cancelado: "Cancelado",
};

export const STATUS_DESC: Record<StatusPedido, string> = {
  recebido: "Recebemos seu pedido e em breve iniciaremos o preparo.",
  em_preparo: "Nossos cozinheiros estão preparando seu pedido com carinho.",
  pronto: "Seu pedido está pronto! Pode vir buscar.",
  saiu_entrega: "Seu pedido saiu para entrega. Fique de olho!",
  finalizado: "Pedido entregue. Obrigado pela preferência!",
  cancelado: "Este pedido foi cancelado.",
};
