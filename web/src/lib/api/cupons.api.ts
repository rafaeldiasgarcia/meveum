import type { Cupon, CriarCuponRequest, AtualizarCuponRequest } from "@/types";
import { obterLojaId, requestAutenticada } from "@/lib/api/client";

const MOCK_CUPONS: Cupon[] = [
  {
    id: "1",
    codigo: "BEMVINDO10",
    tipo: "percentual",
    valor: 10,
    valorMinimoPedido: 30,
    limiteUsos: 100,
    usosAtuais: 23,
    expiracaoEm: "2026-12-31T23:59:59Z",
    ativo: true,
    criadoEm: "2026-05-01T10:00:00Z",
  },
  {
    id: "2",
    codigo: "FRETE0",
    tipo: "fixo",
    valor: 5,
    valorMinimoPedido: 50,
    usosAtuais: 8,
    ativo: true,
    criadoEm: "2026-05-10T10:00:00Z",
  },
  {
    id: "3",
    codigo: "MAIO20",
    tipo: "percentual",
    valor: 20,
    valorMinimoPedido: 60,
    limiteUsos: 50,
    usosAtuais: 50,
    expiracaoEm: "2026-05-31T23:59:59Z",
    ativo: false,
    criadoEm: "2026-05-01T10:00:00Z",
  },
];

let mockCupons = [...MOCK_CUPONS];

export async function listarCupons(): Promise<Cupon[]> {
  try {
    const lojaId = obterLojaId();
    return await requestAutenticada<Cupon[]>(`/cupons?lojaId=${lojaId}`, { method: "GET" });
  } catch {
    return mockCupons;
  }
}

export async function criarCupon(data: CriarCuponRequest): Promise<Cupon> {
  try {
    const lojaId = obterLojaId();
    return await requestAutenticada<Cupon>(`/cupons?lojaId=${lojaId}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    const novo: Cupon = {
      id: String(Date.now()),
      ...data,
      usosAtuais: 0,
      ativo: true,
      criadoEm: new Date().toISOString(),
    };
    mockCupons = [...mockCupons, novo];
    return novo;
  }
}

export async function atualizarCupon(id: string, data: AtualizarCuponRequest): Promise<Cupon> {
  try {
    return await requestAutenticada<Cupon>(`/cupons/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  } catch {
    mockCupons = mockCupons.map((c) => (c.id === id ? { ...c, ...data } : c));
    return mockCupons.find((c) => c.id === id)!;
  }
}

export async function toggleCupon(id: string): Promise<Cupon> {
  try {
    return await requestAutenticada<Cupon>(`/cupons/${id}/toggle`, { method: "PATCH" });
  } catch {
    mockCupons = mockCupons.map((c) => (c.id === id ? { ...c, ativo: !c.ativo } : c));
    return mockCupons.find((c) => c.id === id)!;
  }
}

export async function excluirCupon(id: string): Promise<void> {
  try {
    await requestAutenticada(`/cupons/${id}`, { method: "DELETE" });
  } catch {
    mockCupons = mockCupons.filter((c) => c.id !== id);
  }
}
