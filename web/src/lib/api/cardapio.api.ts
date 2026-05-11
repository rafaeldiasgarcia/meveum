import type { Categoria, Produto, CriarProdutoRequest, AtualizarProdutoRequest } from "@/types";
import { mockCategorias, mockProdutos } from "@/lib/mocks/cardapio.mock";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

let categorias = [...mockCategorias];
let produtos = [...mockProdutos];

export async function listarCategorias(): Promise<Categoria[]> {
  await delay();
  return categorias.filter((c) => c.ativa);
}

export async function listarProdutos(): Promise<Produto[]> {
  await delay();
  return produtos.filter((p) => p.ativo);
}

export async function criarProduto(data: CriarProdutoRequest): Promise<Produto> {
  await delay(600);
  const novo: Produto = {
    ...data,
    id: `prod-${Date.now()}`,
    ativo: true,
    categoria: categorias.find((c) => c.id === data.categoriaId),
  };
  produtos = [...produtos, novo];
  return novo;
}

export async function atualizarProduto(id: string, data: AtualizarProdutoRequest): Promise<Produto> {
  await delay(600);
  produtos = produtos.map((p) => (p.id === id ? { ...p, ...data } : p));
  return produtos.find((p) => p.id === id)!;
}

export async function toggleDisponibilidade(id: string): Promise<Produto> {
  await delay(300);
  produtos = produtos.map((p) => (p.id === id ? { ...p, disponivel: !p.disponivel } : p));
  return produtos.find((p) => p.id === id)!;
}

export async function excluirProduto(id: string): Promise<void> {
  await delay(400);
  produtos = produtos.map((p) => (p.id === id ? { ...p, ativo: false } : p));
}
