import type { Loja, HorarioFuncionamento, TaxaEntrega } from "@/types";
import { mockLoja } from "@/lib/mocks/configuracoes.mock";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

let loja = { ...mockLoja };

export async function buscarLoja(): Promise<Loja> {
  await delay();
  return { ...loja };
}

export async function atualizarLoja(data: Partial<Loja>): Promise<Loja> {
  await delay(600);
  loja = { ...loja, ...data };
  return { ...loja };
}

export async function toggleAberta(): Promise<Loja> {
  await delay(300);
  loja = { ...loja, aberta: !loja.aberta };
  return { ...loja };
}

export async function atualizarHorarios(horarios: HorarioFuncionamento[]): Promise<Loja> {
  await delay(500);
  loja = { ...loja, horarios };
  return { ...loja };
}

export async function atualizarTaxas(taxas: TaxaEntrega[]): Promise<Loja> {
  await delay(500);
  loja = { ...loja, taxasEntrega: taxas };
  return { ...loja };
}
