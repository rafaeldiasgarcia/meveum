import type {
  LojaPublica,
  CategoriaPublica,
  ProdutoPublico,
  GrupoComplemento,
  OpcaoComplemento,
  AreaEntrega,
  FormaPagamentoLoja,
  CriarClienteRequest,
  CriarClienteResponse,
  CriarEnderecoRequest,
  CriarEnderecoResponse,
  CriarPedidoRequest,
  CriarPedidoResponse,
  MensagemWhatsappResponse,
} from "@/types/cardapio-publico";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function buscarLojaPorSlug(slug: string): Promise<LojaPublica> {
  return http<LojaPublica>(`/lojas/slug/${slug}`);
}

export async function listarCategorias(lojaId: string): Promise<CategoriaPublica[]> {
  return http<CategoriaPublica[]>(`/categorias?lojaId=${lojaId}`);
}

export async function listarProdutos(lojaId: string): Promise<ProdutoPublico[]> {
  return http<ProdutoPublico[]>(`/produtos?lojaId=${lojaId}`);
}

export async function listarGruposDoProduto(produtoId: string): Promise<GrupoComplemento[]> {
  type GrupoRaw = Omit<GrupoComplemento, "opcoes">;
  const grupos = await http<GrupoRaw[]>(`/complementos/produtos/${produtoId}/grupos`);

  const gruposComOpcoes = await Promise.all(
    grupos.map(async (grupo) => {
      const opcoes = await http<OpcaoComplemento[]>(
        `/complementos/opcoes?grupoComplementoId=${grupo.grupoComplementoId}`
      );
      return { ...grupo, opcoes };
    })
  );

  return gruposComOpcoes;
}

export async function listarAreasEntrega(lojaId: string): Promise<AreaEntrega[]> {
  return http<AreaEntrega[]>(`/entrega/areas?lojaId=${lojaId}`);
}

export async function listarFormasPagamento(lojaId: string): Promise<FormaPagamentoLoja[]> {
  return http<FormaPagamentoLoja[]>(`/pagamentos/formas?lojaId=${lojaId}`);
}

export async function criarCliente(data: CriarClienteRequest): Promise<CriarClienteResponse> {
  return http<CriarClienteResponse>("/clientes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function criarEndereco(
  clienteId: string,
  data: CriarEnderecoRequest
): Promise<CriarEnderecoResponse> {
  return http<CriarEnderecoResponse>(`/clientes/${clienteId}/enderecos`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function criarPedido(data: CriarPedidoRequest): Promise<CriarPedidoResponse> {
  return http<CriarPedidoResponse>("/pedidos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function buscarMensagemWhatsapp(
  pedidoId: string
): Promise<MensagemWhatsappResponse> {
  return http<MensagemWhatsappResponse>(
    `/integracoes/whatsapp/pedidos/${pedidoId}/mensagem`
  );
}
