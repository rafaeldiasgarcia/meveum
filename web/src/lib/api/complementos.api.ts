import type {
  GrupoComplementoAdmin,
  OpcaoComplementoAdmin,
  CriarGrupoComplementoRequest,
  AtualizarGrupoComplementoRequest,
  CriarOpcaoComplementoRequest,
  AtualizarOpcaoComplementoRequest,
} from "@/types";
import { obterLojaId, requestAutenticada } from "@/lib/api/client";

export async function listarGruposDoProduto(produtoId: string): Promise<GrupoComplementoAdmin[]> {
  type GrupoRaw = Omit<GrupoComplementoAdmin, "opcoes">;
  const grupos = await requestAutenticada<GrupoRaw[]>(`/complementos/produtos/${produtoId}/grupos`);

  return Promise.all(
    grupos.map(async (grupo) => {
      const opcoes = await requestAutenticada<OpcaoComplementoAdmin[]>(
        `/complementos/opcoes?grupoComplementoId=${grupo.grupoComplementoId}`
      );
      return { ...grupo, opcoes };
    })
  );
}

export async function criarGrupoComplemento(data: CriarGrupoComplementoRequest): Promise<GrupoComplementoAdmin> {
  const lojaId = obterLojaId();
  return requestAutenticada<GrupoComplementoAdmin>("/complementos/grupos", {
    method: "POST",
    body: JSON.stringify({
      produtoId: data.produtoId,
      lojaId,
      nomeGrupoComplemento: data.nome,
      quantidadeMinima: data.quantidadeMinima,
      quantidadeMaxima: data.quantidadeMaxima,
      ordem: 0,
    }),
  });
}

export async function atualizarGrupoComplemento(
  grupoComplementoId: string,
  data: AtualizarGrupoComplementoRequest
): Promise<void> {
  await requestAutenticada(`/complementos/grupos/${grupoComplementoId}`, {
    method: "PUT",
    body: JSON.stringify({
      nomeGrupoComplemento: data.nome,
      quantidadeMinima: data.quantidadeMinima,
      quantidadeMaxima: data.quantidadeMaxima,
    }),
  });
}

export async function excluirGrupoComplemento(grupoComplementoId: string): Promise<void> {
  await requestAutenticada(`/complementos/grupos/${grupoComplementoId}`, { method: "DELETE" });
}

export async function criarOpcaoComplemento(data: CriarOpcaoComplementoRequest): Promise<OpcaoComplementoAdmin> {
  return requestAutenticada<OpcaoComplementoAdmin>("/complementos/opcoes", {
    method: "POST",
    body: JSON.stringify({
      grupoComplementoId: data.grupoComplementoId,
      nome: data.nome,
      descricao: data.descricao,
      precoAdicional: data.precoAdicional,
      ordem: 0,
    }),
  });
}

export async function atualizarOpcaoComplemento(
  id: string,
  data: AtualizarOpcaoComplementoRequest
): Promise<void> {
  await requestAutenticada(`/complementos/opcoes/${id}`, {
    method: "PUT",
    body: JSON.stringify({ nome: data.nome, descricao: data.descricao, precoAdicional: data.precoAdicional }),
  });
}

export async function excluirOpcaoComplemento(id: string): Promise<void> {
  await requestAutenticada(`/complementos/opcoes/${id}`, { method: "DELETE" });
}
