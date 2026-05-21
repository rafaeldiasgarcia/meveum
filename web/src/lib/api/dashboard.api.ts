import type {
  ClienteRecorrente,
  DadoGrafico,
  KDSItem,
  MetricasDashboard,
  Pedido,
  PedidoResumo,
  StatusPedido,
  TopProduto,
} from "@/types";
import { obterLojaId, requestAutenticada } from "@/lib/api/client";

type ResumoDashboardApi = {
  faturamentoTotal: number;
  quantidadePedidos: number;
  ticketMedio: number;
  tempoMedioCozinhaMin?: number;
  variacaoPedidos?: number;
  variacaoFaturamento?: number;
  variacaoTicket?: number;
  variacaoTempoCozinha?: number;
  pedidosEmPreparo?: number;
};

type DadoGraficoApi = {
  label: string;
  valor: number;
};

type PedidoResumoApi = {
  id: string;
  numero: number;
  descricao: string;
  nomeCliente: string;
  local: string;
  status: string;
  tempoStr: string;
  total: number;
  formaPagamento?: string;
};

type KdsItemApi = {
  id: string;
  numero: number;
  nomeProduto: string;
  minutosEmPreparo: number;
};

type ProdutoMaisVendidoApi = {
  nomeProduto: string;
  quantidadeVendida: number;
  faturamento: number;
};

type ClienteRecorrenteApi = {
  id: string;
  nome: string;
  iniciais: string;
  totalPedidos: number;
  totalGasto: number;
  badge: "VIP" | "RECORRENTE";
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

function queryPeriodo(periodo: { inicio: string; fim: string }) {
  const lojaId = obterLojaId();
  return `lojaId=${lojaId}&inicio=${encodeURIComponent(periodo.inicio)}&fim=${encodeURIComponent(periodo.fim)}`;
}

export async function buscarMetricas(): Promise<MetricasDashboard> {
  const [resumoHoje, resumo7Dias] = await Promise.all([
    buscarResumo(periodoHoje()),
    buscarResumo(periodoUltimosDias(7)),
  ]);

  return {
    pedidosHoje: Number(resumoHoje.quantidadePedidos ?? 0),
    faturamentoHoje: Number(resumoHoje.faturamentoTotal ?? 0),
    ticketMedio: Number(resumoHoje.ticketMedio ?? 0),
    tempoMedioCozinhaMin: Number(resumoHoje.tempoMedioCozinhaMin ?? 0),
    pedidosEmPreparo: Number(resumoHoje.pedidosEmPreparo ?? 0),
    novosClientesHoje: 0,
    taxaRecompra: 0,
    variacaoPedidosPercent: Number(resumoHoje.variacaoPedidos ?? 0),
    variacaoFaturamentoPercent: Number(resumoHoje.variacaoFaturamento ?? 0),
    variacaoTicketMedio: Number(resumoHoje.variacaoTicket ?? 0),
    variacaoTempoMedioCozinha: Number(resumoHoje.variacaoTempoCozinha ?? 0),
    faturamento7Dias: Number(resumo7Dias.faturamentoTotal ?? 0),
    variacaoFaturamento7Dias: Number(resumo7Dias.variacaoFaturamento ?? 0),
  };
}

export async function buscarGraficoSemanal(): Promise<DadoGrafico[]> {
  const dados = await requestAutenticada<DadoGraficoApi[]>(
    `/dashboard/grafico-semanal?${queryPeriodo(periodoUltimosDias(7))}`,
    { method: "GET" }
  );
  return dados.map((item) => ({ label: item.label, valor: Number(item.valor) }));
}

export async function buscarPedidosRecentes(): Promise<Pedido[]> {
  const pedidos = await buscarPedidosResumo();
  return pedidos.map((pedido) => ({
    id: pedido.id,
    numero: pedido.numero,
    clienteId: "",
    nomeCliente: pedido.nomeCliente,
    telefoneCliente: "",
    status: pedido.status,
    tipo: pedido.local.toLowerCase().includes("retirada") ? "retirada" : "delivery",
    itens: [],
    total: pedido.total,
    formaPagamento: pedido.formaPagamento ?? "pix",
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  }));
}

export async function buscarPedidosResumo(): Promise<PedidoResumo[]> {
  const lojaId = obterLojaId();
  const pedidos = await requestAutenticada<PedidoResumoApi[]>(
    `/dashboard/pedidos-resumo?lojaId=${lojaId}&limite=8`,
    { method: "GET" }
  );

  return pedidos.map((pedido) => ({
    id: pedido.id,
    numero: pedido.numero,
    descricao: pedido.descricao,
    nomeCliente: pedido.nomeCliente,
    local: pedido.local,
    status: toStatusPedido(pedido.status),
    tempoStr: pedido.tempoStr,
    total: Number(pedido.total),
    formaPagamento: toFormaPagamento(pedido.formaPagamento),
  }));
}

export async function buscarKDSItems(): Promise<KDSItem[]> {
  const lojaId = obterLojaId();
  const itens = await requestAutenticada<KdsItemApi[]>(`/dashboard/kds?lojaId=${lojaId}`, { method: "GET" });
  return itens.map((item) => ({
    id: item.id,
    numero: item.numero,
    nomeProduto: item.nomeProduto,
    minutosEmPreparo: Number(item.minutosEmPreparo),
  }));
}

export async function buscarTopProdutos(): Promise<TopProduto[]> {
  const produtos = await requestAutenticada<ProdutoMaisVendidoApi[]>(
    `/dashboard/produtos-mais-vendidos?${queryPeriodo(periodoHoje())}&limite=5`,
    { method: "GET" }
  );

  return produtos.map((produto, index) => ({
    posicao: index + 1,
    nome: produto.nomeProduto,
    unidades: Number(produto.quantidadeVendida),
    faturamento: Number(produto.faturamento),
  }));
}

export async function buscarClientesRecorrentes(): Promise<ClienteRecorrente[]> {
  const lojaId = obterLojaId();
  const clientes = await requestAutenticada<ClienteRecorrenteApi[]>(
    `/dashboard/clientes-recorrentes?lojaId=${lojaId}&limite=5`,
    { method: "GET" }
  );

  return clientes.map((cliente) => ({
    id: cliente.id,
    nome: cliente.nome,
    iniciais: cliente.iniciais,
    totalPedidos: Number(cliente.totalPedidos),
    totalGasto: Number(cliente.totalGasto),
    badge: cliente.badge,
  }));
}

async function buscarResumo(periodo: { inicio: string; fim: string }): Promise<ResumoDashboardApi> {
  return requestAutenticada<ResumoDashboardApi>(`/dashboard/resumo?${queryPeriodo(periodo)}`, { method: "GET" });
}

function toStatusPedido(status: string): StatusPedido {
  const normalizado = status.toLowerCase();
  if (normalizado === "new") return "recebido";
  if (normalizado === "preparing") return "em_preparo";
  if (normalizado === "out_for_delivery") return "saiu_entrega";
  if (normalizado === "done") return "finalizado";
  if (normalizado === "canceled") return "cancelado";
  if (normalizado === "pronto") return "pronto";
  if (normalizado === "recebido" || normalizado === "em_preparo" || normalizado === "saiu_entrega" || normalizado === "finalizado" || normalizado === "cancelado") {
    return normalizado;
  }
  return "recebido";
}

function toFormaPagamento(forma?: string): PedidoResumo["formaPagamento"] {
  const normalizado = forma?.toLowerCase();
  if (normalizado === "pix") return "pix";
  if (normalizado === "cash") return "dinheiro";
  if (normalizado === "credit_card_delivery") return "cartao_credito";
  if (normalizado === "debit_card_delivery") return "cartao_debito";
  if (normalizado === "cartao_credito" || normalizado === "cartao_debito" || normalizado === "dinheiro") {
    return normalizado;
  }
  return undefined;
}
