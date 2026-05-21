import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  atualizarCliente,
  criarCliente,
  criarEnderecoCliente,
  listarClientes,
  listarEnderecosCliente,
} from "@/lib/api/clientes.api";
import * as client from "@/lib/api/client";

vi.mock("@/lib/api/client", () => ({
  obterLojaId: vi.fn(() => "loja-1"),
  requestAutenticada: vi.fn(),
}));

const mockRequestAutenticada = vi.mocked(client.requestAutenticada);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("clientes.api", () => {
  it("mapeia estatisticas reais retornadas pela listagem", async () => {
    mockRequestAutenticada.mockResolvedValueOnce([
      {
        id: "cliente-1",
        lojaId: "loja-1",
        nome: "Ana",
        telefone: "11999999999",
        totalPedidos: 3,
        totalGasto: 120.5,
        ultimoPedido: "2026-05-20T10:00:00Z",
        criadoEm: "2026-05-01T10:00:00Z",
      },
    ]);

    const clientes = await listarClientes("Ana");

    expect(mockRequestAutenticada).toHaveBeenCalledWith(
      "/clientes?lojaId=loja-1&search=Ana",
      expect.objectContaining({ method: "GET" })
    );
    expect(clientes[0].totalPedidos).toBe(3);
    expect(clientes[0].totalGasto).toBe(120.5);
    expect(clientes[0].ultimoPedido).toBe("2026-05-20T10:00:00Z");
  });

  it("cria e atualiza cliente com lojaId do usuario logado", async () => {
    mockRequestAutenticada
      .mockResolvedValueOnce({ id: "cliente-1", lojaId: "loja-1", nome: "Ana", telefone: "119" })
      .mockResolvedValueOnce({ id: "cliente-1", lojaId: "loja-1", nome: "Ana Silva", telefone: "118" });

    await criarCliente({ nome: "Ana", telefone: "119" });
    await atualizarCliente("cliente-1", { nome: "Ana Silva", telefone: "118" });

    expect(mockRequestAutenticada).toHaveBeenNthCalledWith(
      1,
      "/clientes",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("\"lojaId\":\"loja-1\""),
      })
    );
    expect(mockRequestAutenticada).toHaveBeenNthCalledWith(
      2,
      "/clientes/cliente-1",
      expect.objectContaining({ method: "PUT" })
    );
  });

  it("lista e cria enderecos de cliente", async () => {
    const endereco = {
      id: "endereco-1",
      clienteId: "cliente-1",
      rotulo: "Casa",
      rua: "Rua A",
      numero: "10",
      bairro: "Centro",
      cidade: "Sao Paulo",
      estado: "SP",
    };
    mockRequestAutenticada.mockResolvedValueOnce([endereco]).mockResolvedValueOnce(endereco);

    const enderecos = await listarEnderecosCliente("cliente-1");
    await criarEnderecoCliente("cliente-1", {
      rotulo: "Casa",
      rua: "Rua A",
      numero: "10",
      bairro: "Centro",
      cidade: "Sao Paulo",
      estado: "SP",
    });

    expect(enderecos[0].rotulo).toBe("Casa");
    expect(mockRequestAutenticada).toHaveBeenNthCalledWith(
      2,
      "/clientes/cliente-1/enderecos",
      expect.objectContaining({ method: "POST" })
    );
  });
});
