import type { MembroEquipe, ConvidarMembroRequest, CargoEquipe } from "@/types";
import { obterLojaId, requestAutenticada } from "@/lib/api/client";

const MOCK_EQUIPE: MembroEquipe[] = [
  {
    id: "1",
    nome: "Bryan Calvareng",
    email: "bryancalvarenga@outlook.com.br",
    cargo: "OWNER",
    ativo: true,
    criadoEm: "2026-05-01T10:00:00Z",
  },
];

let mockEquipe = [...MOCK_EQUIPE];

export async function listarEquipe(): Promise<MembroEquipe[]> {
  try {
    const lojaId = obterLojaId();
    return await requestAutenticada<MembroEquipe[]>(`/equipe?lojaId=${lojaId}`, { method: "GET" });
  } catch {
    return mockEquipe;
  }
}

export async function convidarMembro(data: ConvidarMembroRequest): Promise<MembroEquipe> {
  try {
    const lojaId = obterLojaId();
    return await requestAutenticada<MembroEquipe>(`/equipe/convidar?lojaId=${lojaId}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    const novo: MembroEquipe = {
      id: String(Date.now()),
      ...data,
      ativo: true,
      criadoEm: new Date().toISOString(),
    };
    mockEquipe = [...mockEquipe, novo];
    return novo;
  }
}

export async function atualizarCargo(id: string, cargo: CargoEquipe): Promise<MembroEquipe> {
  try {
    return await requestAutenticada<MembroEquipe>(`/equipe/${id}/cargo`, {
      method: "PATCH",
      body: JSON.stringify({ cargo }),
    });
  } catch {
    mockEquipe = mockEquipe.map((m) => (m.id === id ? { ...m, cargo } : m));
    return mockEquipe.find((m) => m.id === id)!;
  }
}

export async function removerMembro(id: string): Promise<void> {
  try {
    await requestAutenticada(`/equipe/${id}`, { method: "DELETE" });
  } catch {
    mockEquipe = mockEquipe.filter((m) => m.id !== id);
  }
}
