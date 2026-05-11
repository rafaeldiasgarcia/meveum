import { describe, it, expect, vi, beforeEach } from "vitest";

describe("pedidos.api", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("deve listar pedidos ordenados por data desc", async () => {
    const { listarPedidos } = await import("@/lib/api/pedidos.api");
    const pedidos = await listarPedidos();
    expect(pedidos.length).toBeGreaterThan(0);
    for (let i = 0; i < pedidos.length - 1; i++) {
      const a = new Date(pedidos[i].criadoEm).getTime();
      const b = new Date(pedidos[i + 1].criadoEm).getTime();
      expect(a).toBeGreaterThanOrEqual(b);
    }
  });

  it("deve atualizar status do pedido", async () => {
    const { listarPedidos, atualizarStatusPedido } = await import("@/lib/api/pedidos.api");
    const pedidos = await listarPedidos();
    const pedido = pedidos.find((p) => p.status === "recebido");
    if (!pedido) return;
    const atualizado = await atualizarStatusPedido(pedido.id, "em_preparo");
    expect(atualizado.status).toBe("em_preparo");
    expect(atualizado.id).toBe(pedido.id);
  });
});

describe("cardapio.api", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("deve listar apenas produtos ativos", async () => {
    const { listarProdutos } = await import("@/lib/api/cardapio.api");
    const produtos = await listarProdutos();
    expect(produtos.every((p) => p.ativo)).toBe(true);
  });

  it("deve criar produto e retorná-lo", async () => {
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
    expect(novo.id).toBeDefined();
  });

  it("deve alternar disponibilidade do produto", async () => {
    const { listarProdutos, toggleDisponibilidade } = await import("@/lib/api/cardapio.api");
    const produtos = await listarProdutos();
    const produto = produtos[0];
    const estadoOriginal = produto.disponivel;
    const atualizado = await toggleDisponibilidade(produto.id);
    expect(atualizado.disponivel).toBe(!estadoOriginal);
  });
});

describe("dashboard.api", () => {
  it("deve retornar métricas com campos obrigatórios", async () => {
    const { buscarMetricas } = await import("@/lib/api/dashboard.api");
    const metricas = await buscarMetricas();
    expect(metricas.pedidosHoje).toBeDefined();
    expect(metricas.faturamentoHoje).toBeDefined();
    expect(metricas.ticketMedio).toBeDefined();
    expect(typeof metricas.pedidosHoje).toBe("number");
  });

  it("deve retornar 7 pontos no gráfico semanal", async () => {
    const { buscarGraficoSemanal } = await import("@/lib/api/dashboard.api");
    const grafico = await buscarGraficoSemanal();
    expect(grafico).toHaveLength(7);
    grafico.forEach((d) => {
      expect(d.label).toBeDefined();
      expect(typeof d.valor).toBe("number");
    });
  });
});
