import { randomUUID } from 'node:crypto';

function codigo() {
  return randomUUID().slice(0, 8);
}

export function criarCategoriaPayload(lojaId) {
  const id = codigo();

  return {
    lojaId,
    nome: `Categoria ${id}`,
    descricao: `Categoria criada pela automacao ${id}`,
    ordem: 1,
  };
}

export function atualizarCategoriaPayload(categoria) {
  return {
    nome: `${categoria.nome} Atualizada`,
    descricao: `${categoria.descricao} Atualizada`,
    ordem: 2,
    ativo: true,
  };
}

export function criarProdutoPayload(lojaId, categoriaId) {
  const id = codigo();

  return {
    lojaId,
    categoriaId,
    nome: `Produto ${id}`,
    descricao: `Produto criado pela automacao ${id}`,
    preco: 29.9,
    imagemUrl: null,
    ordem: 1,
  };
}

export function atualizarProdutoPayload(produto) {
  return {
    categoriaId: produto.categoriaId,
    nome: `${produto.nome} Atualizado`,
    descricao: `${produto.descricao} Atualizado`,
    preco: 39.9,
    imagemUrl: produto.imagemUrl,
    ordem: 2,
    ativo: true,
  };
}

export function criarGrupoComplementoPayload(lojaId) {
  const id = codigo();

  return {
    lojaId,
    nome: `Grupo ${id}`,
    descricao: `Grupo de complementos ${id}`,
    quantidadeMinima: 0,
    quantidadeMaxima: 2,
    ordem: 1,
  };
}

export function atualizarGrupoComplementoPayload(grupo) {
  return {
    nome: `${grupo.nome} Atualizado`,
    descricao: `${grupo.descricao} Atualizado`,
    quantidadeMinima: 1,
    quantidadeMaxima: 2,
    ordem: 2,
    ativo: true,
  };
}

export function criarOpcaoComplementoPayload(lojaId, grupoComplementoId) {
  const id = codigo();

  return {
    lojaId,
    grupoComplementoId,
    nome: `Opcao ${id}`,
    descricao: `Opcao criada pela automacao ${id}`,
    precoAdicional: 4.5,
    ordem: 1,
  };
}

export function atualizarOpcaoComplementoPayload(opcao) {
  return {
    nome: `${opcao.nome} Atualizada`,
    descricao: `${opcao.descricao} Atualizada`,
    precoAdicional: 6.5,
    ordem: 2,
    ativo: true,
  };
}

export function vincularGrupoProdutoPayload(grupoComplementoId) {
  return {
    grupoComplementoId,
    ordem: 1,
  };
}
