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

export type TipoAreaEntrega = "NEIGHBORHOOD" | "ZIP_RANGE" | "RADIUS";

export type TaxaEntrega = {
  id: string;
  nome: string;
  tipo: TipoAreaEntrega;
  bairro: string;
  cepInicial?: string;
  cepFinal?: string;
  raioKm?: number;
  taxa: number;
  pedidoMinimo: number;
  tempoEstimadoMinutos: number;
  tempoMin: number;
  ativo: boolean;
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

export type CriarClienteRequest = {
  nome: string;
  telefone: string;
};

export type AtualizarClienteRequest = CriarClienteRequest;

export type EnderecoCliente = {
  id: string;
  clienteId: string;
  rotulo?: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep?: string;
  referencia?: string;
  latitude?: number;
  longitude?: number;
};

export type CriarEnderecoClienteRequest = Omit<EnderecoCliente, "id" | "clienteId">;
export type AtualizarEnderecoClienteRequest = CriarEnderecoClienteRequest;

// ─── Categorias (admin) ───────────────────────────────────────────────────────
export type CriarCategoriaRequest = {
  nome: string;
  descricao?: string;
  ordem?: number;
};

export type AtualizarCategoriaRequest = Partial<CriarCategoriaRequest>;

// ─── Complementos (admin) ─────────────────────────────────────────────────────
export type GrupoComplementoAdmin = {
  id: string;
  lojaId?: string;
  produtoId?: string;
  vinculoId?: string;
  grupoComplementoId: string;
  nomeGrupoComplemento: string;
  descricao?: string;
  quantidadeMinima: number;
  quantidadeMaxima: number;
  ordem: number;
  ativo?: boolean;
  opcoes: OpcaoComplementoAdmin[];
};

export type OpcaoComplementoAdmin = {
  id: string;
  nome: string;
  descricao?: string;
  precoAdicional: number;
  ordem: number;
};

export type CriarGrupoComplementoRequest = {
  produtoId?: string;
  nome: string;
  descricao?: string;
  quantidadeMinima: number;
  quantidadeMaxima: number;
  ordem?: number;
};

export type AtualizarGrupoComplementoRequest = {
  nome?: string;
  descricao?: string;
  quantidadeMinima?: number;
  quantidadeMaxima?: number;
  ordem?: number;
  ativo?: boolean;
};

export type CriarOpcaoComplementoRequest = {
  grupoComplementoId: string;
  nome: string;
  descricao?: string;
  precoAdicional: number;
};

export type AtualizarOpcaoComplementoRequest = {
  nome?: string;
  descricao?: string;
  precoAdicional?: number;
};

export type VincularGrupoComplementoProdutoRequest = {
  grupoComplementoId: string;
  ordem?: number;
};

// ─── Formas de pagamento (admin) ──────────────────────────────────────────────
export type TipoFormaPagamento = "PIX" | "CREDIT_CARD_DELIVERY" | "DEBIT_CARD_DELIVERY" | "CASH";

export type FormaPagamento = {
  id: string;
  tipo: TipoFormaPagamento;
  ativo: boolean;
};

// ─── Cupons ───────────────────────────────────────────────────────────────────
export type TipoCupon = "percentual" | "fixo";

export type Cupon = {
  id: string;
  codigo: string;
  tipo: TipoCupon;
  valor: number;
  valorMinimoPedido?: number;
  limiteUsos?: number;
  usosAtuais: number;
  expiracaoEm?: string;
  ativo: boolean;
  criadoEm: string;
};

export type CriarCuponRequest = {
  codigo: string;
  tipo: TipoCupon;
  valor: number;
  valorMinimoPedido?: number;
  limiteUsos?: number;
  expiracaoEm?: string;
};

export type AtualizarCuponRequest = Partial<CriarCuponRequest>;

// ─── WhatsApp ─────────────────────────────────────────────────────────────────
export type MensagensWhatsApp = {
  recebido: string;
  em_preparo: string;
  saiu_entrega: string;
  finalizado: string;
};

export type ConfigWhatsApp = {
  numero: string;
  mensagens: MensagensWhatsApp;
};

// ─── Financeiro ───────────────────────────────────────────────────────────────
export type PeriodoFinanceiro = "hoje" | "7dias" | "30dias" | "mes";

export type ItemFormaPagamentoFinanceiro = {
  forma: string;
  label: string;
  total: number;
  percentual: number;
};

export type RelatorioFinanceiro = {
  faturamentoTotal: number;
  pedidosPagos: number;
  pedidosCancelados: number;
  ticketMedio: number;
  porFormaPagamento: ItemFormaPagamentoFinanceiro[];
  grafico: DadoGrafico[];
};

// ─── Relatórios ───────────────────────────────────────────────────────────────
export type PeriodoRelatorio = "7dias" | "30dias" | "90dias";

export type HorarioPico = {
  hora: string;
  pedidos: number;
};

export type RelatorioOperacional = {
  topProdutos: TopProduto[];
  horariosPico: HorarioPico[];
  clientesNovos: number;
  clientesRecorrentes: number;
  totalClientes: number;
  vendasPorDia: DadoGrafico[];
};

// ─── Equipe ───────────────────────────────────────────────────────────────────
export type CargoEquipe = "OWNER" | "MANAGER" | "STAFF";

export type MembroEquipe = {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cargo: CargoEquipe;
  ativo: boolean;
  criadoEm: string;
};

export type ConvidarMembroRequest = {
  email: string;
  nome: string;
  cargo: CargoEquipe;
};

// ─── Onboarding ───────────────────────────────────────────────────────────────
export type EtapaOnboarding =
  | "dados_loja"
  | "horarios"
  | "entrega_retirada"
  | "pagamentos";

export type OnboardingStatus = {
  etapasCompletas: EtapaOnboarding[];
  concluido: boolean;
};

// ─── Aparência da Loja ────────────────────────────────────────────────────────
export type AparenciaLoja = {
  nome: string;
  descricao?: string;
  slug: string;
  logoUrl?: string;
  capaBannerUrl?: string;
  corPrimaria?: string;
};

export type AtualizarAparenciaRequest = Partial<AparenciaLoja>;

// ─── Entrega e Retirada ───────────────────────────────────────────────────────
export type ConfigEntregaRetirada = {
  deliveryAtivo: boolean;
  retiradaAtivo: boolean;
  pedidoMinimo: number;
  tempoMedioEntregaMin: number;
  tempoMedioRetiradaMin: number;
  taxasEntrega: TaxaEntrega[];
};

export type AreaEntregaRequest = {
  nome: string;
  tipo: TipoAreaEntrega;
  bairro?: string;
  cepInicial?: string;
  cepFinal?: string;
  raioKm?: number;
  taxa: number;
  pedidoMinimo?: number;
  tempoEstimadoMinutos?: number;
  ativo?: boolean;
};

// ─── Status Público do Pedido ─────────────────────────────────────────────────
export type HistoricoStatusPedido = {
  status: StatusPedido;
  ocorridoEm: string;
};

export type PedidoPublico = {
  token: string;
  numero: number;
  nomeCliente: string;
  status: StatusPedido;
  tipo: "delivery" | "retirada" | "mesa";
  itens: { nomeProduto: string; quantidade: number; subtotal: number }[];
  total: number;
  historico: HistoricoStatusPedido[];
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
