import { describe, it, expect, vi, beforeEach } from "vitest";
import { listarFormasPagamento, criarFormaPagamento, excluirFormaPagamento, toggleFormaPagamento } from "@/lib/api/pagamentos.api";
import * as client from "@/lib/api/client";

vi.mock("@/lib/api/client", () => ({
  obterLojaId: vi.fn(() => "loja-1"),
  requestAutenticada: vi.fn(),
}));

const mockRequestAutenticada = vi.mocked(client.requestAutenticada);

const formaMock = { id: "forma-1", formaPagamento: "PIX" as const, ativo: true };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("listarFormasPagamento", () => {
  it("deve retornar lista de formas de pagamento mapeadas", async () => {
    mockRequestAutenticada.mockResolvedValueOnce([formaMock, { id: "forma-2", formaPagamento: "CASH", ativo: false }]);

    const resultado = await listarFormasPagamento();

    expect(resultado).toHaveLength(2);
    expect(resultado[0].tipo).toBe("PIX");
    expect(resultado[0].ativo).toBe(true);
    expect(resultado[1].tipo).toBe("CASH");
    expect(resultado[1].ativo).toBe(false);
  });

  it("deve chamar o endpoint correto com o lojaId", async () => {
    mockRequestAutenticada.mockResolvedValueOnce([]);

    await listarFormasPagamento();

    expect(mockRequestAutenticada).toHaveBeenCalledWith(
      expect.stringContaining("/pagamentos/formas?lojaId=loja-1")
    );
  });
});

describe("criarFormaPagamento", () => {
  it("deve criar forma de pagamento e retornar mapeada", async () => {
    mockRequestAutenticada.mockResolvedValueOnce(formaMock);

    const resultado = await criarFormaPagamento("PIX");

    expect(mockRequestAutenticada).toHaveBeenCalledWith(
      "/pagamentos/formas",
      expect.objectContaining({ method: "POST" })
    );
    expect(resultado.tipo).toBe("PIX");
  });
});

describe("excluirFormaPagamento", () => {
  it("deve chamar o endpoint DELETE com o id correto", async () => {
    mockRequestAutenticada.mockResolvedValueOnce(undefined);

    await excluirFormaPagamento("forma-1");

    expect(mockRequestAutenticada).toHaveBeenCalledWith(
      "/pagamentos/formas/forma-1",
      expect.objectContaining({ method: "DELETE" })
    );
  });
});

describe("toggleFormaPagamento", () => {
  it("deve chamar PATCH com o novo estado", async () => {
    mockRequestAutenticada.mockResolvedValueOnce({ ...formaMock, ativo: false });

    const resultado = await toggleFormaPagamento("forma-1", false);

    expect(mockRequestAutenticada).toHaveBeenCalledWith(
      "/pagamentos/formas/forma-1",
      expect.objectContaining({ method: "PATCH" })
    );
    expect(resultado.ativo).toBe(false);
  });
});
