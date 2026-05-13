import type { Categoria, Produto, CriarProdutoRequest, AtualizarProdutoRequest } from "@/types";
import { obterLojaId, requestAutenticada } from "@/lib/api/client";

type CategoriaApi = {
  id: string;
  lojaId: string;
  nome: string;
  descricao?: string;
  ordem?: number;
  ativo: boolean;
};

type ProdutoApi = {
  id: string;
  lojaId: string;
  categoriaId: string;
  nome: string;
  descricao?: string;
  preco: number;
  imagemUrl?: string;
  ordem?: number;
  ativo: boolean;
};

function toCategoria(categoria: CategoriaApi): Categoria {
  return {
    id: categoria.id,
    nome: categoria.nome,
    ativa: categoria.ativo,
    ordem: categoria.ordem ?? 0,
  };
}

function toProduto(produto: ProdutoApi, categorias: Categoria[] = []): Produto {
  return {
    id: produto.id,
    nome: produto.nome,
    descricao: produto.descricao,
    preco: Number(produto.preco),
    imagemUrl: produto.imagemUrl,
    categoriaId: produto.categoriaId,
    categoria: categorias.find((categoria) => categoria.id === produto.categoriaId),
    disponivel: produto.ativo,
    ativo: produto.ativo,
    destaque: false,
  };
}

export async function listarCategorias(): Promise<Categoria[]> {
  const lojaId = obterLojaId();
  const categorias = await requestAutenticada<CategoriaApi[]>(`/categorias?lojaId=${lojaId}`, { method: "GET" });
  return categorias.map(toCategoria).filter((categoria) => categoria.ativa);
}

export async function listarProdutos(): Promise<Produto[]> {
  const lojaId = obterLojaId();
  const [produtos, categorias] = await Promise.all([
    requestAutenticada<ProdutoApi[]>(`/produtos?lojaId=${lojaId}`, { method: "GET" }),
    listarCategorias(),
  ]);

  return produtos.map((produto) => toProduto(produto, categorias)).filter((produto) => produto.ativo);
}

export async function criarProduto(data: CriarProdutoRequest): Promise<Produto> {
  const lojaId = obterLojaId();
  const produto = await requestAutenticada<ProdutoApi>("/produtos", {
    method: "POST",
    body: JSON.stringify({
      lojaId,
      categoriaId: data.categoriaId,
      nome: data.nome,
      descricao: data.descricao,
      preco: data.preco,
      imagemUrl: data.imagemUrl,
      ordem: 0,
    }),
  });

  return toProduto(produto, await listarCategorias());
}

export async function atualizarProduto(id: string, data: AtualizarProdutoRequest): Promise<Produto> {
  const produto = await requestAutenticada<ProdutoApi>(`/produtos/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      categoriaId: data.categoriaId,
      nome: data.nome,
      descricao: data.descricao,
      preco: data.preco,
      imagemUrl: data.imagemUrl,
      ordem: 0,
      ativo: data.disponivel ?? true,
    }),
  });

  return toProduto(produto, await listarCategorias());
}

export async function toggleDisponibilidade(id: string): Promise<Produto> {
  const produtoAtual = (await listarProdutos()).find((produto) => produto.id === id);
  if (!produtoAtual) {
    throw new Error("Produto nao encontrado.");
  }

  return atualizarProduto(id, {
    nome: produtoAtual.nome,
    descricao: produtoAtual.descricao,
    preco: produtoAtual.preco,
    categoriaId: produtoAtual.categoriaId,
    disponivel: !produtoAtual.disponivel,
    destaque: produtoAtual.destaque,
  });
}

export async function excluirProduto(id: string): Promise<void> {
  await requestAutenticada<void>(`/produtos/${id}`, { method: "DELETE" });
}
