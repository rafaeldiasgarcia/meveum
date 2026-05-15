import { describe, it, expect, vi, beforeEach } from "vitest";
import { listarTodasCategorias, criarCategoria, atualizarCategoria, excluirCategoria } from "@/lib/api/cardapio.api";
import * as client from "@/lib/api/client";

vi.mock("@/lib/api/client", () => ({
  obterLojaId: vi.fn(() => "loja-1"),
  requestAutenticada: vi.fn(),
}));

const mockRequestAutenticada = vi.mocked(client.requestAutenticada);

const categoriaApiMock = { id: "cat-1", lojaId: "loja-1", nome: "Hambúrgueres", descricao: "Burgers", ordem: 0, ativo: true };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("listarTodasCategorias", () => {
  it("deve retornar todas as categorias incluindo inativas", async () => {
    mockRequestAutenticada.mockResolvedValueOnce([
      categoriaApiMock,
      { ...categoriaApiMock, id: "cat-2", nome: "Bebidas", ativo: false },
    ]);

    const resultado = await listarTodasCategorias();

    expect(resultado).toHaveLength(2);
    expect(resultado[0].nome).toBe("Hambúrgueres");
    expect(resultado[1].ativa).toBe(false);
  });
});

describe("criarCategoria", () => {
  it("deve chamar o endpoint correto com os dados", async () => {
    mockRequestAutenticada.mockResolvedValueOnce(categoriaApiMock);

    const resultado = await criarCategoria({ nome: "Hambúrgueres", descricao: "Burgers" });

    expect(mockRequestAutenticada).toHaveBeenCalledWith(
      "/categorias",
      expect.objectContaining({ method: "POST" })
    );
    expect(resultado.nome).toBe("Hambúrgueres");
    expect(resultado.ativa).toBe(true);
  });
});

describe("atualizarCategoria", () => {
  it("deve chamar o endpoint PUT com o id correto", async () => {
    mockRequestAutenticada.mockResolvedValueOnce({ ...categoriaApiMock, nome: "Lanches" });

    const resultado = await atualizarCategoria("cat-1", { nome: "Lanches" });

    expect(mockRequestAutenticada).toHaveBeenCalledWith(
      "/categorias/cat-1",
      expect.objectContaining({ method: "PUT" })
    );
    expect(resultado.nome).toBe("Lanches");
  });
});

describe("excluirCategoria", () => {
  it("deve chamar o endpoint DELETE com o id correto", async () => {
    mockRequestAutenticada.mockResolvedValueOnce(undefined);

    await excluirCategoria("cat-1");

    expect(mockRequestAutenticada).toHaveBeenCalledWith(
      "/categorias/cat-1",
      expect.objectContaining({ method: "DELETE" })
    );
  });
});
