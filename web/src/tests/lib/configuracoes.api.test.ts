import { beforeEach, describe, expect, it, vi } from "vitest";
import { atualizarTaxaEntrega, criarTaxaEntrega, listarTaxasEntrega } from "@/lib/api/configuracoes.api";
import * as client from "@/lib/api/client";

vi.mock("@/lib/api/client", () => ({
  obterLojaId: vi.fn(() => "loja-1"),
  requestAutenticada: vi.fn(),
}));

const mockRequestAutenticada = vi.mocked(client.requestAutenticada);

const lojaMock = {
  id: "loja-1",
  nome: "Loja",
  slug: "loja",
  whatsappNumber: "119",
  status: "ACTIVE",
  pausadaManualmente: false,
  operacional: true,
};

const areaMock = {
  id: "area-1",
  nome: "Centro",
  tipo: "NEIGHBORHOOD",
  bairro: "Centro",
  taxa: 7.5,
  pedidoMinimo: 20,
  tempoEstimadoMinutos: 35,
  ativo: true,
};

beforeEach(() => {
  vi.clearAllMocks();
});

function mockBuscarLoja() {
  mockRequestAutenticada
    .mockResolvedValueOnce(lojaMock)
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce([areaMock]);
}

describe("configuracoes.api areas de entrega", () => {
  it("lista areas com campos completos", async () => {
    mockRequestAutenticada.mockResolvedValueOnce([areaMock]);

    const areas = await listarTaxasEntrega();

    expect(mockRequestAutenticada).toHaveBeenCalledWith(
      "/entrega/areas?lojaId=loja-1",
      expect.objectContaining({ method: "GET" })
    );
    expect(areas[0].nome).toBe("Centro");
    expect(areas[0].pedidoMinimo).toBe(20);
    expect(areas[0].tempoEstimadoMinutos).toBe(35);
  });

  it("cria area sem payload placeholder", async () => {
    mockRequestAutenticada.mockResolvedValueOnce(areaMock);
    mockBuscarLoja();

    await criarTaxaEntrega({
      nome: "Centro",
      tipo: "NEIGHBORHOOD",
      bairro: "Centro",
      taxa: 7.5,
      pedidoMinimo: 20,
      tempoEstimadoMinutos: 35,
    });

    expect(mockRequestAutenticada).toHaveBeenNthCalledWith(
      1,
      "/entrega/areas",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("\"nome\":\"Centro\""),
      })
    );
    expect(mockRequestAutenticada).toHaveBeenNthCalledWith(
      1,
      "/entrega/areas",
      expect.objectContaining({
        body: expect.not.stringContaining("Nova taxa de entrega"),
      })
    );
  });

  it("atualiza area existente", async () => {
    mockRequestAutenticada.mockResolvedValueOnce(areaMock);
    mockBuscarLoja();

    await atualizarTaxaEntrega("area-1", {
      nome: "Raio centro",
      tipo: "RADIUS",
      raioKm: 5,
      taxa: 9,
      pedidoMinimo: 30,
      tempoEstimadoMinutos: 40,
    });

    expect(mockRequestAutenticada).toHaveBeenNthCalledWith(
      1,
      "/entrega/areas/area-1",
      expect.objectContaining({
        method: "PUT",
        body: expect.stringContaining("\"tipo\":\"RADIUS\""),
      })
    );
  });
});
