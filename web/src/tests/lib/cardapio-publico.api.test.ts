import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const BASE = "http://localhost:8080";

function mockFetch(responses: Record<string, unknown>) {
  return vi.fn((url: string) => {
    const path = url.replace(BASE, "");
    const key = Object.keys(responses).find((k) => path.startsWith(k));
    const body = key ? responses[key] : { erro: "not found" };
    const ok = !!key;
    return Promise.resolve({
      ok,
      status: ok ? 200 : 404,
      json: () => Promise.resolve(body),
      text: () => Promise.resolve(ok ? "" : "Not found"),
    });
  });
}

describe("buscarLojaPorSlug", () => {
  afterEach(() => vi.restoreAllMocks());

  it("deve chamar GET /lojas/slug/{slug}", async () => {
    const lojaFake = { id: "loja-1", nome: "Teste", slug: "teste", operacional: true };
    vi.stubGlobal("fetch", mockFetch({ "/lojas/slug/teste": lojaFake }));

    const { buscarLojaPorSlug } = await import("@/lib/api/cardapio-publico.api");
    const loja = await buscarLojaPorSlug("teste");

    expect(loja.id).toBe("loja-1");
    expect(loja.nome).toBe("Teste");
  });

  it("deve lançar erro quando loja não encontrada", async () => {
    vi.stubGlobal("fetch", mockFetch({}));

    const { buscarLojaPorSlug } = await import("@/lib/api/cardapio-publico.api");
    await expect(buscarLojaPorSlug("nao-existe")).rejects.toThrow("404");
  });
});

describe("listarCategorias", () => {
  afterEach(() => vi.restoreAllMocks());

  it("deve chamar GET /categorias?lojaId=", async () => {
    const categoriasFake = [{ id: "cat-1", nome: "Hambúrgueres", ordem: 1, ativo: true }];
    vi.stubGlobal("fetch", mockFetch({ "/categorias": categoriasFake }));

    const { listarCategorias } = await import("@/lib/api/cardapio-publico.api");
    const categorias = await listarCategorias("loja-1");

    expect(categorias).toHaveLength(1);
    expect(categorias[0].nome).toBe("Hambúrgueres");
  });
});

describe("listarProdutos", () => {
  afterEach(() => vi.restoreAllMocks());

  it("deve retornar lista de produtos da loja", async () => {
    const produtosFake = [
      { id: "prod-1", nome: "Smash Clássico", preco: 32.9, categoriaId: "cat-1", ativo: true },
      { id: "prod-2", nome: "Smash Bacon", preco: 38.9, categoriaId: "cat-1", ativo: true },
    ];
    vi.stubGlobal("fetch", mockFetch({ "/produtos": produtosFake }));

    const { listarProdutos } = await import("@/lib/api/cardapio-publico.api");
    const produtos = await listarProdutos("loja-1");

    expect(produtos).toHaveLength(2);
    expect(produtos[0].preco).toBe(32.9);
  });
});

describe("listarGruposDoProduto", () => {
  afterEach(() => vi.restoreAllMocks());

  it("deve mesclar grupos com suas opções em paralelo", async () => {
    const gruposFake = [
      {
        id: "vínculo-1",
        grupoComplementoId: "grp-1",
        nomeGrupoComplemento: "Ponto da carne",
        quantidadeMinima: 1,
        quantidadeMaxima: 1,
        ordem: 1,
        ativo: true,
      },
    ];
    const opcoesFake = [
      { id: "opc-1", nome: "Ao ponto", precoAdicional: 0, ordem: 1 },
      { id: "opc-2", nome: "Bem passado", precoAdicional: 0, ordem: 2 },
    ];

    vi.stubGlobal(
      "fetch",
      mockFetch({
        "/complementos/produtos/prod-1/grupos": gruposFake,
        "/complementos/opcoes": opcoesFake,
      })
    );

    const { listarGruposDoProduto } = await import("@/lib/api/cardapio-publico.api");
    const grupos = await listarGruposDoProduto("prod-1");

    expect(grupos).toHaveLength(1);
    expect(grupos[0].nomeGrupoComplemento).toBe("Ponto da carne");
    expect(grupos[0].opcoes).toHaveLength(2);
    expect(grupos[0].opcoes[0].nome).toBe("Ao ponto");
  });

  it("deve retornar lista vazia quando produto sem complementos", async () => {
    vi.stubGlobal("fetch", mockFetch({ "/complementos/produtos/prod-sem/grupos": [] }));

    const { listarGruposDoProduto } = await import("@/lib/api/cardapio-publico.api");
    const grupos = await listarGruposDoProduto("prod-sem");

    expect(grupos).toHaveLength(0);
  });
});

describe("criarCliente", () => {
  afterEach(() => vi.restoreAllMocks());

  it("deve fazer POST /clientes com os dados corretos", async () => {
    const clienteFake = { id: "cli-1", lojaId: "loja-1", nome: "João", telefone: "11999999999" };
    const fetchMock = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(clienteFake) })
    );
    vi.stubGlobal("fetch", fetchMock);

    const { criarCliente } = await import("@/lib/api/cardapio-publico.api");
    const cliente = await criarCliente({ lojaId: "loja-1", nome: "João", telefone: "11999999999" });

    expect(cliente.id).toBe("cli-1");

    const chamada = fetchMock.mock.calls[0];
    expect(chamada[0]).toBe(`${BASE}/clientes`);
    expect(chamada[1]?.method).toBe("POST");

    const body = JSON.parse(chamada[1]?.body as string);
    expect(body.nome).toBe("João");
    expect(body.telefone).toBe("11999999999");
    expect(body.lojaId).toBe("loja-1");
  });
});

describe("criarPedido", () => {
  afterEach(() => vi.restoreAllMocks());

  it("deve fazer POST /pedidos com tipoRecebimento e formaPagamento corretos", async () => {
    const pedidoFake = { id: "ped-1", nomeCliente: "Maria", total: 32.9, status: "NEW" };
    const fetchMock = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(pedidoFake) })
    );
    vi.stubGlobal("fetch", fetchMock);

    const { criarPedido } = await import("@/lib/api/cardapio-publico.api");
    await criarPedido({
      lojaId: "loja-1",
      clienteId: "cli-1",
      nomeCliente: "Maria",
      telefoneCliente: "11988888888",
      tipoRecebimento: "PICKUP",
      formaPagamento: "PIX",
      itens: [{ produtoId: "prod-1", quantidade: 1, complementos: [] }],
    });

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.tipoRecebimento).toBe("PICKUP");
    expect(body.formaPagamento).toBe("PIX");
    expect(body.itens).toHaveLength(1);
  });

  it("deve incluir enderecoClienteId quando delivery", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ id: "ped-2", total: 50, status: "NEW" }) })
    );
    vi.stubGlobal("fetch", fetchMock);

    const { criarPedido } = await import("@/lib/api/cardapio-publico.api");
    await criarPedido({
      lojaId: "loja-1",
      clienteId: "cli-1",
      enderecoClienteId: "end-1",
      nomeCliente: "Maria",
      telefoneCliente: "11988888888",
      tipoRecebimento: "DELIVERY",
      formaPagamento: "CASH",
      precisaTroco: true,
      trocoPara: 50,
      itens: [],
    });

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.enderecoClienteId).toBe("end-1");
    expect(body.tipoRecebimento).toBe("DELIVERY");
    expect(body.precisaTroco).toBe(true);
    expect(body.trocoPara).toBe(50);
  });
});

describe("buscarMensagemWhatsapp", () => {
  afterEach(() => vi.restoreAllMocks());

  it("deve retornar urlEnvio pronta para abrir", async () => {
    const msgFake = {
      pedidoId: "ped-1",
      telefoneDestino: "5511999999999",
      mensagem: "Novo pedido...",
      urlEnvio: "https://wa.me/5511999999999?text=Novo+pedido...",
    };
    vi.stubGlobal("fetch", mockFetch({ "/integracoes/whatsapp/pedidos/ped-1/mensagem": msgFake }));

    const { buscarMensagemWhatsapp } = await import("@/lib/api/cardapio-publico.api");
    const msg = await buscarMensagemWhatsapp("ped-1");

    expect(msg.urlEnvio).toContain("wa.me");
    expect(msg.telefoneDestino).toBe("5511999999999");
  });
});
