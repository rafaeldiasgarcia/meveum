import type { FormaPagamento, TipoFormaPagamento } from "@/types";
import { obterLojaId, requestAutenticada } from "@/lib/api/client";

type FormaPagamentoApi = {
  id: string;
  formaPagamento: TipoFormaPagamento;
  ativo: boolean;
};

function toFormaPagamento(f: FormaPagamentoApi): FormaPagamento {
  return { id: f.id, tipo: f.formaPagamento, ativo: f.ativo };
}

export async function listarFormasPagamento(): Promise<FormaPagamento[]> {
  const lojaId = obterLojaId();
  const formas = await requestAutenticada<FormaPagamentoApi[]>(`/pagamentos/formas?lojaId=${lojaId}`);
  return formas.map(toFormaPagamento);
}

export async function criarFormaPagamento(tipo: TipoFormaPagamento): Promise<FormaPagamento> {
  const lojaId = obterLojaId();
  const forma = await requestAutenticada<FormaPagamentoApi>("/pagamentos/formas", {
    method: "POST",
    body: JSON.stringify({ lojaId, formaPagamento: tipo }),
  });
  return toFormaPagamento(forma);
}

export async function excluirFormaPagamento(id: string): Promise<void> {
  await requestAutenticada(`/pagamentos/formas/${id}`, { method: "DELETE" });
}

export async function toggleFormaPagamento(id: string, ativo: boolean): Promise<FormaPagamento> {
  const forma = await requestAutenticada<FormaPagamentoApi>(`/pagamentos/formas/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ ativo }),
  });
  return toFormaPagamento(forma);
}
