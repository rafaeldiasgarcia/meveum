import type {
  AparenciaLoja,
  AreaEntregaRequest,
  AtualizarAparenciaRequest,
  ConfigEntregaRetirada,
  DiaSemana,
  HorarioFuncionamento,
  Loja,
  TaxaEntrega,
  TipoAreaEntrega,
} from "@/types";
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
  tipo: TipoAreaEntrega;
  bairro?: string;
  cepInicial?: string;
  cepFinal?: string;
  raioKm?: number;
  taxa: number;
  pedidoMinimo?: number;
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
  const tempoEstimadoMinutos = taxa.tempoEstimadoMinutos ?? 45;
  return {
    id: taxa.id,
    nome: taxa.nome,
    tipo: taxa.tipo,
    bairro: taxa.bairro ?? taxa.nome,
    cepInicial: taxa.cepInicial,
    cepFinal: taxa.cepFinal,
    raioKm: taxa.raioKm == null ? undefined : Number(taxa.raioKm),
    taxa: Number(taxa.taxa),
    pedidoMinimo: Number(taxa.pedidoMinimo ?? 0),
    tempoEstimadoMinutos,
    tempoMin: tempoEstimadoMinutos,
    ativo: taxa.ativo,
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

export async function criarTaxaEntrega(data: AreaEntregaRequest): Promise<Loja> {
  const lojaId = obterLojaId();
  await requestAutenticada("/entrega/areas", {
    method: "POST",
    body: JSON.stringify(toAreaEntregaBody(lojaId, data)),
  });

  return buscarLoja();
}

export async function atualizarTaxaEntrega(id: string, data: AreaEntregaRequest): Promise<Loja> {
  const lojaId = obterLojaId();
  await requestAutenticada(`/entrega/areas/${id}`, {
    method: "PUT",
    body: JSON.stringify({ ...toAreaEntregaBody(lojaId, data), ativo: data.ativo ?? true }),
  });
  return buscarLoja();
}

export async function removerTaxaEntrega(id: string): Promise<Loja> {
  await requestAutenticada(`/entrega/areas/${id}`, { method: "DELETE" });
  return buscarLoja();
}

export async function buscarAparencia(): Promise<AparenciaLoja> {
  try {
    const lojaId = obterLojaId();
    const loja = await requestAutenticada<LojaApi>(`/lojas/${lojaId}`, { method: "GET" });
    return { nome: loja.nome, slug: loja.slug, logoUrl: loja.logoUrl };
  } catch {
    return { nome: "", slug: "", logoUrl: undefined, descricao: undefined, capaBannerUrl: undefined, corPrimaria: "#EA580C" };
  }
}

export async function atualizarAparencia(data: AtualizarAparenciaRequest): Promise<AparenciaLoja> {
  const lojaId = obterLojaId();
  await requestAutenticada(`/lojas/${lojaId}`, {
    method: "PUT",
    body: JSON.stringify({ nome: data.nome, slug: data.slug, logoUrl: data.logoUrl }),
  });
  return buscarAparencia();
}

export async function verificarSlugDisponivel(slug: string): Promise<boolean> {
  try {
    await requestAutenticada(`/lojas/slug/${slug}`, { method: "GET" });
    return false;
  } catch {
    return true;
  }
}

export async function buscarConfigEntrega(): Promise<ConfigEntregaRetirada> {
  const taxasEntrega = await listarTaxasEntrega();
  return {
    deliveryAtivo: true,
    retiradaAtivo: true,
    pedidoMinimo: 0,
    tempoMedioEntregaMin: 45,
    tempoMedioRetiradaMin: 20,
    taxasEntrega,
  };
}

export async function listarTaxasEntrega(): Promise<TaxaEntrega[]> {
  const lojaId = obterLojaId();
  const taxas = await requestAutenticada<TaxaApi[]>(`/entrega/areas?lojaId=${lojaId}`, { method: "GET" });
  return taxas.map(toTaxa);
}

export async function criarTaxaEntregaDetalhada(taxa: Omit<TaxaEntrega, "id">): Promise<Loja> {
  return criarTaxaEntrega({
    nome: taxa.nome ?? taxa.bairro,
    tipo: taxa.tipo ?? "NEIGHBORHOOD",
    bairro: taxa.bairro,
    cepInicial: taxa.cepInicial,
    cepFinal: taxa.cepFinal,
    raioKm: taxa.raioKm,
    taxa: taxa.taxa,
    pedidoMinimo: taxa.pedidoMinimo,
    tempoEstimadoMinutos: taxa.tempoEstimadoMinutos ?? taxa.tempoMin,
  });
}

function toAreaEntregaBody(lojaId: string, data: AreaEntregaRequest) {
  return {
    lojaId,
    nome: data.nome,
    tipo: data.tipo,
    bairro: data.tipo === "NEIGHBORHOOD" ? data.bairro : undefined,
    cepInicial: data.tipo === "ZIP_RANGE" ? data.cepInicial : undefined,
    cepFinal: data.tipo === "ZIP_RANGE" ? data.cepFinal : undefined,
    raioKm: data.tipo === "RADIUS" ? data.raioKm : undefined,
    taxa: data.taxa,
    pedidoMinimo: data.pedidoMinimo ?? 0,
    tempoEstimadoMinutos: data.tempoEstimadoMinutos ?? 45,
  };
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
