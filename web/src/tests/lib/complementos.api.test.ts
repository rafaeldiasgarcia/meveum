import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  criarGrupoComplemento,
  desvincularGrupoDoProduto,
  listarGruposComplemento,
  listarGruposDoProduto,
  vincularGrupoAoProduto,
} from "@/lib/api/complementos.api";
import * as client from "@/lib/api/client";

vi.mock("@/lib/api/client", () => ({
  obterLojaId: vi.fn(() => "loja-1"),
  requestAutenticada: vi.fn(),
}));

const mockRequestAutenticada = vi.mocked(client.requestAutenticada);

const grupoApi = {
  id: "grupo-1",
  lojaId: "loja-1",
  nome: "Adicionais",
  descricao: "Extras",
  quantidadeMinima: 0,
  quantidadeMaxima: 2,
  ordem: 0,
  ativo: true,
};

const vinculoApi = {
  id: "vinculo-1",
  produtoId: "produto-1",
  grupoComplementoId: "grupo-1",
  nomeGrupoComplemento: "Adicionais",
  quantidadeMinima: 0,
  quantidadeMaxima: 2,
  ordem: 0,
  ativo: true,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("complementos.api", () => {
  it("lista grupos da loja usando o contrato do backend", async () => {
    mockRequestAutenticada.mockResolvedValueOnce([grupoApi]);

    const grupos = await listarGruposComplemento();

    expect(mockRequestAutenticada).toHaveBeenCalledWith("/complementos/grupos?lojaId=loja-1");
    expect(grupos[0].grupoComplementoId).toBe("grupo-1");
    expect(grupos[0].nomeGrupoComplemento).toBe("Adicionais");
  });

  it("cria grupo com campo nome e vincula ao produto quando informado", async () => {
    mockRequestAutenticada
      .mockResolvedValueOnce(grupoApi)
      .mockResolvedValueOnce(vinculoApi)
      .mockResolvedValueOnce([]);

    await criarGrupoComplemento({
      produtoId: "produto-1",
      nome: "Adicionais",
      quantidadeMinima: 0,
      quantidadeMaxima: 2,
    });

    expect(mockRequestAutenticada).toHaveBeenNthCalledWith(
      1,
      "/complementos/grupos",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("\"nome\":\"Adicionais\""),
      })
    );
    expect(mockRequestAutenticada).toHaveBeenNthCalledWith(
      2,
      "/complementos/produtos/produto-1/grupos",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("lista grupos vinculados ao produto com opcoes", async () => {
    mockRequestAutenticada
      .mockResolvedValueOnce([vinculoApi])
      .mockResolvedValueOnce([{ id: "opcao-1", grupoComplementoId: "grupo-1", nome: "Bacon", precoAdicional: 4, ordem: 0 }]);

    const grupos = await listarGruposDoProduto("produto-1");

    expect(grupos[0].vinculoId).toBe("vinculo-1");
    expect(grupos[0].opcoes[0].nome).toBe("Bacon");
  });

  it("vincula e desvincula grupo existente do produto", async () => {
    mockRequestAutenticada
      .mockResolvedValueOnce(vinculoApi)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(undefined);

    await vincularGrupoAoProduto("produto-1", { grupoComplementoId: "grupo-1" });
    await desvincularGrupoDoProduto("produto-1", "grupo-1");

    expect(mockRequestAutenticada).toHaveBeenNthCalledWith(
      1,
      "/complementos/produtos/produto-1/grupos",
      expect.objectContaining({ method: "POST" })
    );
    expect(mockRequestAutenticada).toHaveBeenNthCalledWith(
      3,
      "/complementos/produtos/produto-1/grupos/grupo-1",
      expect.objectContaining({ method: "DELETE" })
    );
  });
});
