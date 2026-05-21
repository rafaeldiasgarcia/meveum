import type {
  AtualizarGrupoComplementoRequest,
  AtualizarOpcaoComplementoRequest,
  CriarGrupoComplementoRequest,
  CriarOpcaoComplementoRequest,
  GrupoComplementoAdmin,
  OpcaoComplementoAdmin,
  VincularGrupoComplementoProdutoRequest,
} from "@/types";
import { obterLojaId, requestAutenticada } from "@/lib/api/client";

type GrupoComplementoApi = {
  id: string;
  lojaId: string;
  nome: string;
  descricao?: string;
  quantidadeMinima: number;
  quantidadeMaxima: number;
  ordem?: number;
  ativo: boolean;
};

type GrupoProdutoApi = {
  id: string;
  produtoId: string;
  grupoComplementoId: string;
  nomeGrupoComplemento: string;
  quantidadeMinima: number;
  quantidadeMaxima: number;
  ordem?: number;
  ativo: boolean;
};

type OpcaoComplementoApi = {
  id: string;
  grupoComplementoId: string;
  nome: string;
  descricao?: string;
  precoAdicional: number;
  ordem?: number;
  ativo?: boolean;
};

function toOpcao(opcao: OpcaoComplementoApi): OpcaoComplementoAdmin {
  return {
    id: opcao.id,
    nome: opcao.nome,
    descricao: opcao.descricao,
    precoAdicional: Number(opcao.precoAdicional),
    ordem: opcao.ordem ?? 0,
  };
}

function toGrupo(grupo: GrupoComplementoApi, opcoes: OpcaoComplementoAdmin[] = []): GrupoComplementoAdmin {
  return {
    id: grupo.id,
    lojaId: grupo.lojaId,
    grupoComplementoId: grupo.id,
    nomeGrupoComplemento: grupo.nome,
    descricao: grupo.descricao,
    quantidadeMinima: grupo.quantidadeMinima,
    quantidadeMaxima: grupo.quantidadeMaxima,
    ordem: grupo.ordem ?? 0,
    ativo: grupo.ativo,
    opcoes,
  };
}

function toGrupoProduto(grupo: GrupoProdutoApi, opcoes: OpcaoComplementoAdmin[] = []): GrupoComplementoAdmin {
  return {
    id: grupo.grupoComplementoId,
    vinculoId: grupo.id,
    produtoId: grupo.produtoId,
    grupoComplementoId: grupo.grupoComplementoId,
    nomeGrupoComplemento: grupo.nomeGrupoComplemento,
    quantidadeMinima: grupo.quantidadeMinima,
    quantidadeMaxima: grupo.quantidadeMaxima,
    ordem: grupo.ordem ?? 0,
    ativo: grupo.ativo,
    opcoes,
  };
}

export async function listarGruposComplemento(): Promise<GrupoComplementoAdmin[]> {
  const lojaId = obterLojaId();
  const grupos = await requestAutenticada<GrupoComplementoApi[]>(`/complementos/grupos?lojaId=${lojaId}`);
  return grupos.map((grupo) => toGrupo(grupo));
}

export async function listarOpcoesComplemento(grupoComplementoId: string): Promise<OpcaoComplementoAdmin[]> {
  const opcoes = await requestAutenticada<OpcaoComplementoApi[]>(
    `/complementos/opcoes?grupoComplementoId=${grupoComplementoId}`
  );
  return opcoes.map(toOpcao);
}

export async function listarGruposDoProduto(produtoId: string): Promise<GrupoComplementoAdmin[]> {
  const grupos = await requestAutenticada<GrupoProdutoApi[]>(`/complementos/produtos/${produtoId}/grupos`);

  return Promise.all(
    grupos.map(async (grupo) => {
      const opcoes = await listarOpcoesComplemento(grupo.grupoComplementoId);
      return toGrupoProduto(grupo, opcoes);
    })
  );
}

export async function criarGrupoComplemento(data: CriarGrupoComplementoRequest): Promise<GrupoComplementoAdmin> {
  const lojaId = obterLojaId();
  const grupo = await requestAutenticada<GrupoComplementoApi>("/complementos/grupos", {
    method: "POST",
    body: JSON.stringify({
      lojaId,
      nome: data.nome,
      descricao: data.descricao,
      quantidadeMinima: data.quantidadeMinima,
      quantidadeMaxima: data.quantidadeMaxima,
      ordem: data.ordem ?? 0,
    }),
  });

  if (data.produtoId) {
    await vincularGrupoAoProduto(data.produtoId, { grupoComplementoId: grupo.id, ordem: data.ordem ?? 0 });
  }

  return toGrupo(grupo);
}

export async function atualizarGrupoComplemento(
  grupoComplementoId: string,
  data: AtualizarGrupoComplementoRequest
): Promise<GrupoComplementoAdmin> {
  const grupo = await requestAutenticada<GrupoComplementoApi>(`/complementos/grupos/${grupoComplementoId}`, {
    method: "PUT",
    body: JSON.stringify({
      nome: data.nome,
      descricao: data.descricao,
      quantidadeMinima: data.quantidadeMinima,
      quantidadeMaxima: data.quantidadeMaxima,
      ordem: data.ordem,
      ativo: data.ativo,
    }),
  });
  return toGrupo(grupo);
}

export async function excluirGrupoComplemento(grupoComplementoId: string): Promise<void> {
  await requestAutenticada(`/complementos/grupos/${grupoComplementoId}`, { method: "DELETE" });
}

export async function vincularGrupoAoProduto(
  produtoId: string,
  data: VincularGrupoComplementoProdutoRequest
): Promise<GrupoComplementoAdmin> {
  const grupo = await requestAutenticada<GrupoProdutoApi>(`/complementos/produtos/${produtoId}/grupos`, {
    method: "POST",
    body: JSON.stringify({ grupoComplementoId: data.grupoComplementoId, ordem: data.ordem ?? 0 }),
  });
  const opcoes = await listarOpcoesComplemento(grupo.grupoComplementoId);
  return toGrupoProduto(grupo, opcoes);
}

export async function desvincularGrupoDoProduto(produtoId: string, grupoComplementoId: string): Promise<void> {
  await requestAutenticada(`/complementos/produtos/${produtoId}/grupos/${grupoComplementoId}`, {
    method: "DELETE",
  });
}

export async function criarOpcaoComplemento(data: CriarOpcaoComplementoRequest): Promise<OpcaoComplementoAdmin> {
  const opcao = await requestAutenticada<OpcaoComplementoApi>("/complementos/opcoes", {
    method: "POST",
    body: JSON.stringify({
      grupoComplementoId: data.grupoComplementoId,
      nome: data.nome,
      descricao: data.descricao,
      precoAdicional: data.precoAdicional,
      ordem: 0,
    }),
  });
  return toOpcao(opcao);
}

export async function atualizarOpcaoComplemento(
  id: string,
  data: AtualizarOpcaoComplementoRequest
): Promise<OpcaoComplementoAdmin> {
  const opcao = await requestAutenticada<OpcaoComplementoApi>(`/complementos/opcoes/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      nome: data.nome,
      descricao: data.descricao,
      precoAdicional: data.precoAdicional,
    }),
  });
  return toOpcao(opcao);
}

export async function excluirOpcaoComplemento(id: string): Promise<void> {
  await requestAutenticada(`/complementos/opcoes/${id}`, { method: "DELETE" });
}
