import type { OnboardingStatus, EtapaOnboarding } from "@/types";
import { obterLojaId, requestAutenticada } from "@/lib/api/client";

const STORAGE_KEY = "meveum_onboarding";

function lerLocal(): OnboardingStatus {
  if (typeof window === "undefined") return { etapasCompletas: [], concluido: false };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OnboardingStatus) : { etapasCompletas: [], concluido: false };
  } catch {
    return { etapasCompletas: [], concluido: false };
  }
}

function salvarLocal(status: OnboardingStatus) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
  }
}

export async function buscarOnboarding(): Promise<OnboardingStatus> {
  try {
    const lojaId = obterLojaId();
    return await requestAutenticada<OnboardingStatus>(`/onboarding?lojaId=${lojaId}`, { method: "GET" });
  } catch {
    return lerLocal();
  }
}

export async function concluirEtapa(etapa: EtapaOnboarding): Promise<OnboardingStatus> {
  try {
    const lojaId = obterLojaId();
    return await requestAutenticada<OnboardingStatus>(`/onboarding/etapa`, {
      method: "PATCH",
      body: JSON.stringify({ lojaId, etapa }),
    });
  } catch {
    const atual = lerLocal();
    const etapasCompletas = atual.etapasCompletas.includes(etapa)
      ? atual.etapasCompletas
      : [...atual.etapasCompletas, etapa];
    const todas: EtapaOnboarding[] = ["dados_loja", "horarios", "entrega_retirada", "pagamentos"];
    const concluido = todas.every((e) => etapasCompletas.includes(e));
    const novo = { etapasCompletas, concluido };
    salvarLocal(novo);
    return novo;
  }
}

export async function pularOnboarding(): Promise<void> {
  const todas: EtapaOnboarding[] = ["dados_loja", "horarios", "entrega_retirada", "pagamentos"];
  salvarLocal({ etapasCompletas: todas, concluido: true });
}
