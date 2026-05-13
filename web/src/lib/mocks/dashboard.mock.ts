import type {
  MetricasDashboard,
  DadoGrafico,
  KDSItem,
  TopProduto,
  ClienteRecorrente,
  PedidoResumo,
} from "@/types";

export const mockMetricas: MetricasDashboard = {
  pedidosHoje: 182,
  faturamentoHoje: 8640.0,
  ticketMedio: 47.8,
  tempoMedioCozinhaMin: 23,
  pedidosEmPreparo: 7,
  novosClientesHoje: 5,
  taxaRecompra: 68,
  variacaoPedidosPercent: 24,
  variacaoFaturamentoPercent: 18,
  variacaoTicketMedio: 3.2,
  variacaoTempoMedioCozinha: -4,
  faturamento7Dias: 28940.0,
  variacaoFaturamento7Dias: 24,
};

export const mockGraficoSemanal: DadoGrafico[] = [
  { label: "Seg", valor: 3200 },
  { label: "Ter", valor: 4100 },
  { label: "Qua", valor: 3600 },
  { label: "Qui", valor: 5200 },
  { label: "Sex", valor: 4800 },
  { label: "Sáb", valor: 5940 },
  { label: "Dom", valor: 2100 },
];

export const mockKDSItems: KDSItem[] = [
  { id: "1024", numero: 1024, nomeProduto: "Smash Bacon Duplo", minutosEmPreparo: 4 },
  { id: "1018", numero: 1018, nomeProduto: "Smash Cheese", minutosEmPreparo: 9 },
  { id: "1017", numero: 1017, nomeProduto: "Pizza Marguerita", minutosEmPreparo: 14 },
];

export const mockTopProdutos: TopProduto[] = [
  { posicao: 1, nome: "Smash Bacon Duplo", unidades: 38, faturamento: 1478 },
  { posicao: 2, nome: "Pizza Calabresa", unidades: 22, faturamento: 1144 },
  { posicao: 3, nome: "Combo Família", unidades: 9, faturamento: 1079 },
  { posicao: 4, nome: "Açaí 500ml", unidades: 27, faturamento: 672 },
];

export const mockClientesRecorrentes: ClienteRecorrente[] = [
  { id: "1", nome: "Marina Alves", iniciais: "MA", totalPedidos: 12, totalGasto: 612, badge: "VIP" },
  { id: "2", nome: "João Pedro", iniciais: "JP", totalPedidos: 8, totalGasto: 432, badge: "RECORRENTE" },
  { id: "3", nome: "Patricia Bento", iniciais: "PB", totalPedidos: 6, totalGasto: 298, badge: "RECORRENTE" },
  { id: "4", nome: "Bruno Carmo", iniciais: "BC", totalPedidos: 5, totalGasto: 245, badge: "RECORRENTE" },
];

export const mockPedidosResumo: PedidoResumo[] = [
  {
    id: "1024", numero: 1024,
    descricao: "Smash Bacon Duplo + Fritas G",
    nomeCliente: "Marina Alves", local: "Mesa 08",
    status: "em_preparo", tempoStr: "00:04", total: 52.8,
  },
  {
    id: "1023", numero: 1023,
    descricao: "Combo Familia · 4 burgers, 2 fritas, 2 refris",
    nomeCliente: "João Pedro", local: "Delivery",
    status: "saiu_entrega", tempoStr: "00:11", total: 119.9,
  },
  {
    id: "1022", numero: 1022,
    descricao: "Pizza Calabresa Artesanal",
    nomeCliente: "Bruno Carmo", local: "Mesa 03",
    status: "finalizado", tempoStr: "00:18", total: 64.0, formaPagamento: "pix",
  },
  {
    id: "1021", numero: 1021,
    descricao: "Açaí 500ml + Granola + Leite condensado",
    nomeCliente: "Patricia Bento", local: "Balcão",
    status: "pronto", tempoStr: "00:22", total: 24.9,
  },
  {
    id: "1020", numero: 1020,
    descricao: "Hambúrguer Clássico + Coca 350ml",
    nomeCliente: "Lucas Mendes", local: "Delivery",
    status: "recebido", tempoStr: "00:26", total: 38.9,
  },
  {
    id: "1019", numero: 1019,
    descricao: "Pizza 4 Queijos broto",
    nomeCliente: "Renata Sá", local: "Mesa 05",
    status: "pronto", tempoStr: "00:31", total: 42.0,
  },
  {
    id: "1018", numero: 1018,
    descricao: "Smash Cheese + Fritas P",
    nomeCliente: "Caio Vinicius", local: "Delivery",
    status: "em_preparo", tempoStr: "00:34", total: 33.8,
  },
];
