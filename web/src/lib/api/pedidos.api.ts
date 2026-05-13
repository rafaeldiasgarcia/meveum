import type { Pedido, StatusPedido } from "@/types";
import { obterLojaId, requestAutenticada } from "@/lib/api/client";

type StatusPedidoApi = "NEW" | "PREPARING" | "OUT_FOR_DELIVERY" | "DONE" | "CANCELED";
type TipoRecebimentoApi = "DELIVERY" | "PICKUP";

type ListarPedidoApi = {
  id: string;
  lojaId: string;
  nomeCliente: string;
  telefoneCliente: string;
  tipoRecebimento: TipoRecebimentoApi;
  status: StatusPedidoApi;
  formaPagamento: string;
  total: number;
  criadoEm: string;
};

type DetalharPedidoApi = ListarPedidoApi & {
  clienteId?: string;
  taxaEntrega?: number;
  observacaoCliente?: string;
  enderecoEntrega?: string;
  atualizadoEm?: string;
  itens?: Array<{
    id: string;
    produtoId: string;
    nomeProduto: string;
    quantidade: number;
    precoUnitario: number;
    total: number;
    observacao?: string;
  }>;
};

const STATUS_API: Record<StatusPedido, StatusPedidoApi> = {
  recebido: "NEW",
  em_preparo: "PREPARING",
  pronto: "OUT_FOR_DELIVERY",
  saiu_entrega: "OUT_FOR_DELIVERY",
  finalizado: "DONE",
  cancelado: "CANCELED",
};

const STATUS_WEB: Record<StatusPedidoApi, StatusPedido> = {
  NEW: "recebido",
  PREPARING: "em_preparo",
  OUT_FOR_DELIVERY: "saiu_entrega",
  DONE: "finalizado",
  CANCELED: "cancelado",
};

function toPedido(pedido: ListarPedidoApi | DetalharPedidoApi, index = 0): Pedido {
  const detalhado = pedido as DetalharPedidoApi;
  return {
    id: pedido.id,
    numero: index + 1,
    clienteId: detalhado.clienteId ?? "",
    nomeCliente: pedido.nomeCliente,
    telefoneCliente: pedido.telefoneCliente,
    status: STATUS_WEB[pedido.status],
    tipo: pedido.tipoRecebimento === "DELIVERY" ? "delivery" : "retirada",
    itens: (detalhado.itens ?? []).map((item) => ({
      id: item.id,
      produtoId: item.produtoId,
      nomeProduto: item.nomeProduto,
      quantidade: item.quantidade,
      precoUnitario: Number(item.precoUnitario),
      subtotal: Number(item.total),
      observacao: item.observacao,
    })),
    total: Number(pedido.total),
    enderecoEntrega: detalhado.enderecoEntrega,
    taxaEntrega: detalhado.taxaEntrega ? Number(detalhado.taxaEntrega) : undefined,
    observacao: detalhado.observacaoCliente,
    formaPagamento: toFormaPagamento(pedido.formaPagamento),
    criadoEm: pedido.criadoEm,
    atualizadoEm: detalhado.atualizadoEm ?? pedido.criadoEm,
  };
}

function toFormaPagamento(valor: string): Pedido["formaPagamento"] {
  const formas: Record<string, Pedido["formaPagamento"]> = {
    PIX: "pix",
    CREDIT_CARD: "cartao_credito",
    DEBIT_CARD: "cartao_debito",
    CASH: "dinheiro",
  };

  return formas[valor] ?? "pix";
}

export async function listarPedidos(status?: StatusPedido | "todos"): Promise<Pedido[]> {
  const lojaId = obterLojaId();
  const queryStatus = status && status !== "todos" ? `&status=${STATUS_API[status]}` : "";
  const pedidos = await requestAutenticada<ListarPedidoApi[]>(`/pedidos?lojaId=${lojaId}${queryStatus}`, { method: "GET" });
  return pedidos.map(toPedido);
}

export async function buscarPedido(id: string): Promise<Pedido | undefined> {
  const pedido = await requestAutenticada<DetalharPedidoApi>(`/pedidos/${id}`, { method: "GET" });
  return toPedido(pedido);
}

export async function atualizarStatusPedido(id: string, status: StatusPedido): Promise<Pedido> {
  await requestAutenticada(`/pedidos/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: STATUS_API[status] }),
  });

  const pedido = await buscarPedido(id);
  if (!pedido) {
    throw new Error("Pedido nao encontrado.");
  }

  return pedido;
}
