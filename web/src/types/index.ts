// ─── Auth ─────────────────────────────────────────────────────────────────────
export type Usuario = {
  id: string;
  lojaId?: string;
  nome: string;
  email: string;
  role?: "OWNER" | "MANAGER" | "STAFF";
  avatar?: string;
};

export type LoginRequest = { email: string; senha: string };
export type LoginResponse = { token: string; usuario: Usuario };
export type CadastroRequest = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  nomeLoja: string;
  telefone: string;
};

// ─── Loja ─────────────────────────────────────────────────────────────────────
export type Loja = {
  id: string;
  nome: string;
  descricao?: string;
  telefone: string;
  endereco: string;
  pixKey?: string;
  whatsapp?: string;
  ativa: boolean;
  aberta: boolean;
  logoUrl?: string;
  horarios: HorarioFuncionamento[];
  taxasEntrega: TaxaEntrega[];
};

export type HorarioFuncionamento = {
  id: string;
  diaSemana: DiaSemana;
  abertura: string;
  fechamento: string;
  ativo: boolean;
};

export type DiaSemana = "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";

export type TaxaEntrega = {
  id: string;
  bairro: string;
  taxa: number;
  tempoMin: number;
};

// ─── Cardápio ─────────────────────────────────────────────────────────────────
export type Categoria = {
  id: string;
  nome: string;
  ativa: boolean;
  ordem: number;
};

export type Produto = {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  imagemUrl?: string;
  categoriaId: string;
  categoria?: Categoria;
  disponivel: boolean;
  ativo: boolean;
  destaque: boolean;
};

export type CriarProdutoRequest = {
  nome: string;
  descricao?: string;
  preco: number;
  categoriaId: string;
  imagemUrl?: string;
  disponivel: boolean;
  destaque: boolean;
};

export type AtualizarProdutoRequest = Partial<CriarProdutoRequest>;

// ─── Pedidos ──────────────────────────────────────────────────────────────────
export type StatusPedido =
  | "recebido"
  | "em_preparo"
  | "pronto"
  | "saiu_entrega"
  | "finalizado"
  | "cancelado";

export type ItemPedido = {
  id: string;
  produtoId: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  observacao?: string;
};

export type Pedido = {
  id: string;
  numero: number;
  clienteId: string;
  nomeCliente: string;
  telefoneCliente: string;
  status: StatusPedido;
  tipo: "delivery" | "retirada" | "mesa";
  mesa?: string;
  itens: ItemPedido[];
  total: number;
  enderecoEntrega?: string;
  bairroEntrega?: string;
  taxaEntrega?: number;
  observacao?: string;
  formaPagamento: "pix" | "cartao_credito" | "cartao_debito" | "dinheiro";
  criadoEm: string;
  atualizadoEm: string;
};

export type AtualizarStatusPedidoRequest = { status: StatusPedido };

// ─── Clientes ─────────────────────────────────────────────────────────────────
export type Cliente = {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  totalPedidos: number;
  totalGasto: number;
  ultimoPedido: string;
  criadoEm: string;
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export type MetricasDashboard = {
  pedidosHoje: number;
  faturamentoHoje: number;
  ticketMedio: number;
  tempoMedioCozinhaMin: number;
  pedidosEmPreparo: number;
  novosClientesHoje: number;
  taxaRecompra: number;
  variacaoPedidosPercent: number;
  variacaoFaturamentoPercent: number;
  variacaoTicketMedio: number;
  variacaoTempoMedioCozinha: number;
  faturamento7Dias: number;
  variacaoFaturamento7Dias: number;
};

export type DadoGrafico = {
  label: string;
  valor: number;
};

export type KDSItem = {
  id: string;
  numero: number;
  nomeProduto: string;
  minutosEmPreparo: number;
};

export type TopProduto = {
  posicao: number;
  nome: string;
  unidades: number;
  faturamento: number;
};

export type ClienteRecorrente = {
  id: string;
  nome: string;
  iniciais: string;
  totalPedidos: number;
  totalGasto: number;
  badge: "VIP" | "RECORRENTE";
};

export type PedidoResumo = {
  id: string;
  numero: number;
  descricao: string;
  nomeCliente: string;
  local: string;
  status: StatusPedido;
  tempoStr: string;
  total: number;
  formaPagamento?: "pix" | "cartao_credito" | "cartao_debito" | "dinheiro";
};
