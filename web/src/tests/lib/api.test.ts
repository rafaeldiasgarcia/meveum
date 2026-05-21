import { beforeEach, describe, expect, it, vi } from "vitest";

const BASE = "http://localhost:8080";

function prepararSessao() {
  window.localStorage.setItem("meveum_token", "token-jwt");
  window.localStorage.setItem("meveum_usuario", JSON.stringify({
    id: "user-1",
    lojaId: "loja-1",
    nome: "Admin",
    email: "admin@meveum.com",
    role: "OWNER",
  }));
}

function mockFetch(responses: Record<string, unknown>) {
  return vi.fn((url: string, init?: RequestInit) => {
    const path = url.replace(BASE, "");
    const key = Object.keys(responses).find((item) => path.startsWith(item));
    if (!key) {
      return Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ mensagem: "Nao encontrado." }),
      });
    }

    return Promise.resolve({
      ok: true,
      status: init?.method === "DELETE" ? 204 : 200,
      json: () => Promise.resolve(responses[key]),
    });
  });
}

describe("pedidos.api", () => {
  beforeEach(() => {
    vi.resetModules();
    window.localStorage.clear();
    prepararSessao();
  });

  it("deve listar pedidos ordenados por data desc", async () => {
    vi.stubGlobal("fetch", mockFetch({
      "/pedidos": [
        { id: "ped-1", nomeCliente: "Ana", telefoneCliente: "119", tipoRecebimento: "PICKUP", status: "NEW", formaPagamento: "PIX", total: 10, criadoEm: "2026-05-13T10:00:00Z" },
        { id: "ped-2", nomeCliente: "Bia", telefoneCliente: "118", tipoRecebimento: "PICKUP", status: "DONE", formaPagamento: "PIX", total: 20, criadoEm: "2026-05-12T10:00:00Z" },
      ],
    }));

    const { listarPedidos } = await import("@/lib/api/pedidos.api");
    const pedidos = await listarPedidos();

    expect(pedidos).toHaveLength(2);
    expect(pedidos[0].status).toBe("recebido");
  });

  it("deve atualizar status do pedido", async () => {
    const fetchMock = mockFetch({
      "/pedidos/ped-1/status": { id: "ped-1", status: "PREPARING" },
      "/pedidos/ped-1": { id: "ped-1", nomeCliente: "Ana", telefoneCliente: "119", tipoRecebimento: "PICKUP", status: "PREPARING", formaPagamento: "PIX", total: 10, criadoEm: "2026-05-13T10:00:00Z", itens: [] },
    });
    vi.stubGlobal("fetch", fetchMock);

    const { atualizarStatusPedido } = await import("@/lib/api/pedidos.api");
    const atualizado = await atualizarStatusPedido("ped-1", "em_preparo");

    expect(atualizado.status).toBe("em_preparo");
    expect(fetchMock).toHaveBeenCalledWith(`${BASE}/pedidos/ped-1/status`, expect.objectContaining({
      method: "PATCH",
    }));
  });
});

describe("cardapio.api", () => {
  beforeEach(() => {
    vi.resetModules();
    window.localStorage.clear();
    prepararSessao();
  });

  it("deve listar apenas produtos ativos", async () => {
    vi.stubGlobal("fetch", mockFetch({
      "/categorias": [{ id: "cat-1", lojaId: "loja-1", nome: "Lanches", ordem: 1, ativo: true }],
      "/produtos": [
        { id: "prod-1", lojaId: "loja-1", categoriaId: "cat-1", nome: "Teste", preco: 25.9, ativo: true },
      ],
    }));

    const { listarProdutos } = await import("@/lib/api/cardapio.api");
    const produtos = await listarProdutos();

    expect(produtos.every((p) => p.ativo)).toBe(true);
  });

  it("deve criar produto no backend e retorná-lo", async () => {
    vi.stubGlobal("fetch", mockFetch({
      "/produtos": { id: "prod-1", lojaId: "loja-1", categoriaId: "cat-1", nome: "Teste Produto", preco: 25.9, ativo: true },
      "/categorias": [{ id: "cat-1", lojaId: "loja-1", nome: "Lanches", ordem: 1, ativo: true }],
    }));

    const { criarProduto } = await import("@/lib/api/cardapio.api");
    const novo = await criarProduto({
      nome: "Teste Produto",
      preco: 25.9,
      categoriaId: "cat-1",
      disponivel: true,
      destaque: false,
    });

    expect(novo.nome).toBe("Teste Produto");
    expect(novo.preco).toBe(25.9);
  });

  it("deve alternar disponibilidade do produto", async () => {
    vi.stubGlobal("fetch", mockFetch({
      "/categorias": [{ id: "cat-1", lojaId: "loja-1", nome: "Lanches", ordem: 1, ativo: true }],
      "/produtos/prod-1": { id: "prod-1", lojaId: "loja-1", categoriaId: "cat-1", nome: "Teste", preco: 25.9, ativo: false },
      "/produtos": [{ id: "prod-1", lojaId: "loja-1", categoriaId: "cat-1", nome: "Teste", preco: 25.9, ativo: true }],
    }));

    const { toggleDisponibilidade } = await import("@/lib/api/cardapio.api");
    const atualizado = await toggleDisponibilidade("prod-1");

    expect(atualizado.disponivel).toBe(false);
  });
});

describe("dashboard.api", () => {
  beforeEach(() => {
    vi.resetModules();
    window.localStorage.clear();
    prepararSessao();
  });

  it("deve retornar métricas com campos obrigatórios", async () => {
    vi.stubGlobal("fetch", mockFetch({
      "/dashboard/resumo": { faturamentoTotal: 100, quantidadePedidos: 2, ticketMedio: 50, pedidosNovos: 1, pedidosEmPreparo: 1 },
    }));

    const { buscarMetricas } = await import("@/lib/api/dashboard.api");
    const metricas = await buscarMetricas();

    expect(metricas.pedidosHoje).toBe(2);
    expect(metricas.faturamentoHoje).toBe(100);
  });

  it("deve retornar 7 pontos no gráfico semanal", async () => {
    vi.stubGlobal("fetch", mockFetch({
      "/dashboard/grafico-semanal": [
        { label: "seg", valor: 10 },
        { label: "ter", valor: 20 },
        { label: "qua", valor: 30 },
        { label: "qui", valor: 40 },
        { label: "sex", valor: 50 },
        { label: "sab", valor: 60 },
        { label: "dom", valor: 70 },
      ],
    }));

    const { buscarGraficoSemanal } = await import("@/lib/api/dashboard.api");
    const grafico = await buscarGraficoSemanal();

    expect(grafico).toHaveLength(7);
    grafico.forEach((d) => {
      expect(d.label).toBeDefined();
      expect(typeof d.valor).toBe("number");
    });
  });
});
