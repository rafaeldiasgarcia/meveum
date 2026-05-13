// ─── Loja ─────────────────────────────────────────────────────────────────────
export type LojaPublica = {
  id: string;
  nome: string;
  slug: string;
  logoUrl: string | null;
  whatsappNumber: string;
  status: "ACTIVE" | "INACTIVE";
  pausadaManualmente: boolean;
  operacional: boolean;
};

// ─── Catálogo ─────────────────────────────────────────────────────────────────
export type CategoriaPublica = {
  id: string;
  nome: string;
  ordem: number;
  ativo: boolean;
};

export type ProdutoPublico = {
  id: string;
  categoriaId: string;
  nome: string;
  descricao: string | null;
  preco: number;
  imagemUrl: string | null;
  ordem: number;
  ativo: boolean;
};

// ─── Complementos ─────────────────────────────────────────────────────────────
export type OpcaoComplemento = {
  id: string;
  nome: string;
  descricao: string | null;
  precoAdicional: number;
  ordem: number;
};

export type GrupoComplemento = {
  id: string;
  grupoComplementoId: string;
  nomeGrupoComplemento: string;
  quantidadeMinima: number;
  quantidadeMaxima: number;
  ordem: number;
  opcoes: OpcaoComplemento[];
};

// ─── Entrega e Pagamento ───────────────────────────────────────────────────────
export type AreaEntrega = {
  id: string;
  nome: string;
  tipo: "NEIGHBORHOOD" | "ZIP_RANGE" | "RADIUS";
  taxa: number;
  pedidoMinimo: number;
  tempoEstimadoMinutos: number;
  ativo: boolean;
};

export type FormaPagamentoLoja = {
  id: string;
  formaPagamento: "PIX" | "CREDIT_CARD_DELIVERY" | "DEBIT_CARD_DELIVERY" | "CASH";
  ativo: boolean;
};

// ─── Carrinho ─────────────────────────────────────────────────────────────────
export type ComplementoSelecionado = {
  opcaoComplementoId: string;
  nomeGrupo: string;
  nomeOpcao: string;
  precoAdicional: number;
  quantidade: number;
};

export type ItemCarrinho = {
  uid: string;
  produtoId: string;
  nomeProduto: string;
  precoBase: number;
  quantidade: number;
  complementosSelecionados: ComplementoSelecionado[];
  subtotal: number;
};

// ─── API requests ─────────────────────────────────────────────────────────────
export type CriarClienteRequest = {
  lojaId: string;
  nome: string;
  telefone: string;
};

export type CriarClienteResponse = {
  id: string;
  lojaId: string;
  nome: string;
  telefone: string;
};

export type CriarEnderecoRequest = {
  rotulo?: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep?: string;
  referencia?: string;
};

export type CriarEnderecoResponse = {
  id: string;
  clienteId: string;
  rua: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string | null;
};

export type ItemPedidoRequest = {
  produtoId: string;
  quantidade: number;
  observacao?: string;
  complementos: { opcaoComplementoId: string; quantidade: number }[];
};

export type CriarPedidoRequest = {
  lojaId: string;
  clienteId: string;
  enderecoClienteId?: string;
  nomeCliente: string;
  telefoneCliente: string;
  tipoRecebimento: "DELIVERY" | "PICKUP";
  formaPagamento: "PIX" | "CREDIT_CARD_DELIVERY" | "DEBIT_CARD_DELIVERY" | "CASH";
  precisaTroco?: boolean;
  trocoPara?: number;
  observacaoCliente?: string;
  itens: ItemPedidoRequest[];
};

export type CriarPedidoResponse = {
  id: string;
  nomeCliente: string;
  total: number;
  status: string;
};

export type MensagemWhatsappResponse = {
  pedidoId: string;
  telefoneDestino: string;
  mensagem: string;
  urlEnvio: string;
};

// ─── Dados do checkout (estado local) ─────────────────────────────────────────
export type DadosCheckout = {
  tipo: "DELIVERY" | "PICKUP" | null;
  nome: string;
  telefone: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  referencia: string;
  areaEntregaId: string | null;
  taxaEntrega: number;
  formaPagamento: "PIX" | "CREDIT_CARD_DELIVERY" | "DEBIT_CARD_DELIVERY" | "CASH" | null;
  precisaTroco: boolean;
  trocoPara: string;
  observacao: string;
};
