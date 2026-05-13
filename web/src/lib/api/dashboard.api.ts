import type {
  ClienteRecorrente,
  DadoGrafico,
  KDSItem,
  MetricasDashboard,
  Pedido,
  PedidoResumo,
  TopProduto,
} from "@/types";
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
  const [resumoHoje, resumo7Dias] = await Promise.all([
    buscarResumoHoje(),
    buscarResumoUltimosDias(),
  ]);

  return {
    pedidosHoje: Number(resumoHoje.quantidadePedidos),
    faturamentoHoje: Number(resumoHoje.faturamentoTotal),
    ticketMedio: Number(resumoHoje.ticketMedio),
    tempoMedioCozinhaMin: 0,
    pedidosEmPreparo: Number(resumoHoje.pedidosEmPreparo),
    novosClientesHoje: 0,
    taxaRecompra: 0,
    variacaoPedidosPercent: 0,
    variacaoFaturamentoPercent: 0,
    variacaoTicketMedio: 0,
    variacaoTempoMedioCozinha: 0,
    faturamento7Dias: Number(resumo7Dias.faturamentoTotal),
    variacaoFaturamento7Dias: 0,
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

export async function buscarPedidosResumo(): Promise<PedidoResumo[]> {
  const pedidos = await listarPedidos();

  return pedidos.slice(0, 8).map((pedido) => ({
    id: pedido.id,
    numero: pedido.numero,
    descricao: descreverPedido(pedido),
    nomeCliente: pedido.nomeCliente,
    local: descreverLocalPedido(pedido),
    status: pedido.status,
    tempoStr: calcularTempoDecorrido(pedido.criadoEm),
    total: pedido.total,
    formaPagamento: pedido.formaPagamento,
  }));
}

export async function buscarKDSItems(): Promise<KDSItem[]> {
  const pedidos = await listarPedidos();

  return pedidos
    .filter((pedido) => pedido.status === "em_preparo")
    .slice(0, 5)
    .map((pedido) => ({
      id: pedido.id,
      numero: pedido.numero,
      nomeProduto: pedido.itens[0]?.nomeProduto ?? "Pedido em preparo",
      minutosEmPreparo: calcularMinutosDesde(pedido.atualizadoEm),
    }));
}

export async function buscarTopProdutos(): Promise<TopProduto[]> {
  const pedidos = await listarPedidos();
  const produtos = new Map<string, { nome: string; unidades: number; faturamento: number }>();

  pedidos.forEach((pedido) => {
    pedido.itens.forEach((item) => {
      const atual = produtos.get(item.produtoId) ?? {
        nome: item.nomeProduto,
        unidades: 0,
        faturamento: 0,
      };

      produtos.set(item.produtoId, {
        nome: atual.nome,
        unidades: atual.unidades + item.quantidade,
        faturamento: atual.faturamento + item.subtotal,
      });
    });
  });

  return [...produtos.values()]
    .sort((a, b) => b.faturamento - a.faturamento)
    .slice(0, 5)
    .map((produto, index) => ({
      posicao: index + 1,
      ...produto,
    }));
}

export async function buscarClientesRecorrentes(): Promise<ClienteRecorrente[]> {
  const pedidos = await listarPedidos();
  const clientes = new Map<string, { nome: string; totalPedidos: number; totalGasto: number }>();

  pedidos.forEach((pedido) => {
    const atual = clientes.get(pedido.clienteId) ?? {
      nome: pedido.nomeCliente,
      totalPedidos: 0,
      totalGasto: 0,
    };

    clientes.set(pedido.clienteId, {
      nome: atual.nome,
      totalPedidos: atual.totalPedidos + 1,
      totalGasto: atual.totalGasto + pedido.total,
    });
  });

  return [...clientes.entries()]
    .filter(([, cliente]) => cliente.totalPedidos > 1)
    .sort(([, a], [, b]) => b.totalGasto - a.totalGasto)
    .slice(0, 5)
    .map(([id, cliente]) => ({
      id,
      nome: cliente.nome,
      iniciais: obterIniciais(cliente.nome),
      totalPedidos: cliente.totalPedidos,
      totalGasto: cliente.totalGasto,
      badge: cliente.totalGasto >= 500 ? "VIP" : "RECORRENTE",
    }));
}

function mesmoDia(data: Date, referencia: Date) {
  return data.getFullYear() === referencia.getFullYear()
    && data.getMonth() === referencia.getMonth()
    && data.getDate() === referencia.getDate();
}

async function buscarResumoHoje(): Promise<ResumoDashboardApi> {
  const lojaId = obterLojaId();
  const { inicio, fim } = periodoHoje();
  return requestAutenticada<ResumoDashboardApi>(
    `/dashboard/resumo?lojaId=${lojaId}&inicio=${encodeURIComponent(inicio)}&fim=${encodeURIComponent(fim)}`,
    { method: "GET" },
  );
}

export async function buscarResumoUltimosDias(): Promise<ResumoDashboardApi> {
  const lojaId = obterLojaId();
  const { inicio, fim } = periodoUltimosDias(7);
  return requestAutenticada<ResumoDashboardApi>(
    `/dashboard/resumo?lojaId=${lojaId}&inicio=${encodeURIComponent(inicio)}&fim=${encodeURIComponent(fim)}`,
    { method: "GET" },
  );
}

function descreverPedido(pedido: Pedido) {
  const [primeiroItem, ...outrosItens] = pedido.itens;
  if (!primeiroItem) return "Pedido sem itens";
  if (outrosItens.length === 0) return primeiroItem.nomeProduto;
  return `${primeiroItem.nomeProduto} + ${outrosItens.length} item(ns)`;
}

function descreverLocalPedido(pedido: Pedido) {
  if (pedido.tipo === "mesa" && pedido.mesa) return `Mesa ${pedido.mesa}`;
  if (pedido.tipo === "retirada") return "Retirada";
  return pedido.bairroEntrega ?? "Delivery";
}

function calcularTempoDecorrido(dataIso: string) {
  const minutos = calcularMinutosDesde(dataIso);
  if (minutos < 60) return `${minutos}min`;
  const horas = Math.floor(minutos / 60);
  const restoMinutos = minutos % 60;
  return restoMinutos > 0 ? `${horas}h ${restoMinutos}min` : `${horas}h`;
}

function calcularMinutosDesde(dataIso: string) {
  const inicio = new Date(dataIso).getTime();
  if (Number.isNaN(inicio)) return 0;
  return Math.max(0, Math.round((Date.now() - inicio) / 60000));
}

function calcularTempoMedioCozinha(pedidos: Pedido[]) {
  if (pedidos.length === 0) return 0;

  const totalMinutos = pedidos.reduce((acc, pedido) => {
    const criadoEm = new Date(pedido.criadoEm).getTime();
    const atualizadoEm = new Date(pedido.atualizadoEm).getTime();
    if (Number.isNaN(criadoEm) || Number.isNaN(atualizadoEm)) return acc;
    return acc + Math.max(0, Math.round((atualizadoEm - criadoEm) / 60000));
  }, 0);

  return Math.round(totalMinutos / pedidos.length);
}

function calcularTaxaRecompra(pedidos: Pedido[]) {
  if (pedidos.length === 0) return 0;

  const pedidosPorCliente = pedidos.reduce((acc, pedido) => {
    acc.set(pedido.clienteId, (acc.get(pedido.clienteId) ?? 0) + 1);
    return acc;
  }, new Map<string, number>());

  const clientesRecorrentes = [...pedidosPorCliente.values()].filter((total) => total > 1).length;
  return Math.round((clientesRecorrentes / pedidosPorCliente.size) * 100);
}

function obterIniciais(nome: string) {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("");
}
