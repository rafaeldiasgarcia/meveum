import type { Loja, HorarioFuncionamento, TaxaEntrega, DiaSemana } from "@/types";
import { obterLojaId, requestAutenticada } from "@/lib/api/client";

type LojaApi = {
  id: string;
  nome: string;
  slug: string;
  logoUrl?: string;
  whatsappNumber: string;
  status: "ACTIVE" | "INACTIVE";
  pausadaManualmente: boolean;
  operacional: boolean;
};

type HorarioApi = {
  id: string;
  diaSemana: number;
  abertura: string;
  fechamento: string;
  ativo: boolean;
};

type TaxaApi = {
  id: string;
  nome: string;
  bairro?: string;
  taxa: number;
  tempoEstimadoMinutos?: number;
  ativo: boolean;
};

const DIAS: DiaSemana[] = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

function horariosPadrao(): HorarioFuncionamento[] {
  return DIAS.map((dia, index) => ({
    id: `horario-${dia}`,
    diaSemana: dia,
    abertura: "18:00",
    fechamento: "23:00",
    ativo: index < 6,
  }));
}

function toHorario(horario: HorarioApi): HorarioFuncionamento {
  return {
    id: horario.id,
    diaSemana: DIAS[horario.diaSemana - 1] ?? "seg",
    abertura: horario.abertura.slice(0, 5),
    fechamento: horario.fechamento.slice(0, 5),
    ativo: horario.ativo,
  };
}

function toHorarioApi(horario: HorarioFuncionamento) {
  return {
    diaSemana: DIAS.indexOf(horario.diaSemana) + 1,
    abertura: horario.abertura,
    fechamento: horario.fechamento,
    ativo: horario.ativo,
  };
}

function toTaxa(taxa: TaxaApi): TaxaEntrega {
  return {
    id: taxa.id,
    bairro: taxa.bairro ?? taxa.nome,
    taxa: Number(taxa.taxa),
    tempoMin: taxa.tempoEstimadoMinutos ?? 45,
  };
}

function toLoja(loja: LojaApi, horarios: HorarioFuncionamento[], taxasEntrega: TaxaEntrega[]): Loja {
  return {
    id: loja.id,
    nome: loja.nome,
    telefone: loja.whatsappNumber,
    endereco: "",
    whatsapp: loja.whatsappNumber,
    ativa: loja.status === "ACTIVE",
    aberta: loja.operacional && !loja.pausadaManualmente,
    logoUrl: loja.logoUrl,
    horarios,
    taxasEntrega,
  };
}

export async function buscarLoja(): Promise<Loja> {
  const lojaId = obterLojaId();
  const [loja, horarios, taxas] = await Promise.all([
    requestAutenticada<LojaApi>(`/lojas/${lojaId}`, { method: "GET" }),
    requestAutenticada<HorarioApi[]>(`/lojas/${lojaId}/horarios`, { method: "GET" }),
    requestAutenticada<TaxaApi[]>(`/entrega/areas?lojaId=${lojaId}`, { method: "GET" }),
  ]);

  return toLoja(
    loja,
    horarios.length ? horarios.map(toHorario) : horariosPadrao(),
    taxas.filter((taxa) => taxa.ativo).map(toTaxa)
  );
}

export async function atualizarLoja(data: Partial<Loja>): Promise<Loja> {
  const lojaAtual = await buscarLoja();
  await requestAutenticada(`/lojas/${lojaAtual.id}`, {
    method: "PUT",
    body: JSON.stringify({
      nome: data.nome ?? lojaAtual.nome,
      slug: slugify(data.nome ?? lojaAtual.nome),
      logoUrl: data.logoUrl ?? lojaAtual.logoUrl,
      whatsappNumber: data.whatsapp ?? data.telefone ?? lojaAtual.telefone,
    }),
  });

  return buscarLoja();
}

export async function toggleAberta(): Promise<Loja> {
  const lojaAtual = await buscarLoja();
  await requestAutenticada(`/lojas/${lojaAtual.id}/pausa-manual`, {
    method: "PATCH",
    body: JSON.stringify({ pausadaManualmente: lojaAtual.aberta }),
  });

  return buscarLoja();
}

export async function atualizarHorarios(horarios: HorarioFuncionamento[]): Promise<Loja> {
  const lojaId = obterLojaId();
  await requestAutenticada(`/lojas/${lojaId}/horarios`, {
    method: "PUT",
    body: JSON.stringify({ horarios: horarios.map(toHorarioApi) }),
  });

  return buscarLoja();
}

export async function criarTaxaEntrega(): Promise<Loja> {
  const lojaId = obterLojaId();
  await requestAutenticada("/entrega/areas", {
    method: "POST",
    body: JSON.stringify({
      lojaId,
      nome: "Nova taxa de entrega",
      tipo: "NEIGHBORHOOD",
      bairro: "Novo bairro",
      taxa: 0,
      pedidoMinimo: 0,
      tempoEstimadoMinutos: 45,
    }),
  });

  return buscarLoja();
}

export async function removerTaxaEntrega(id: string): Promise<Loja> {
  await requestAutenticada(`/entrega/areas/${id}`, { method: "DELETE" });
  return buscarLoja();
}

function slugify(valor: string): string {
  return valor
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "loja";
}
