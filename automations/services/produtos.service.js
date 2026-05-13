import {
  esperarCampos,
  esperarErro,
  esperarListaComItem,
  esperarStatus,
  esperarStatusEJson,
} from './contract.service.js';

export class ProdutosService {
  constructor(request) {
    this.request = request;
  }

  async criar(payload, token) {
    return this.request.post('/produtos', {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async listar(lojaId, categoriaId = null) {
    const query = categoriaId
      ? `/produtos?lojaId=${lojaId}&categoriaId=${categoriaId}`
      : `/produtos?lojaId=${lojaId}`;
    return this.request.get(query);
  }

  async detalhar(produtoId, token) {
    return this.request.get(`/produtos/${produtoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async atualizar(produtoId, payload, token) {
    return this.request.put(`/produtos/${produtoId}`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async excluir(produtoId, token) {
    return this.request.delete(`/produtos/${produtoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async validarCriacao(payload, token) {
    const body = await esperarStatusEJson(await this.criar(payload, token), 201);
    esperarCampos(body, {
      lojaId: payload.lojaId,
      categoriaId: payload.categoriaId,
      nome: payload.nome,
      descricao: payload.descricao,
      preco: payload.preco,
      ordem: payload.ordem,
      ativo: true,
    });
    return body;
  }

  async validarListagem(lojaId, produtoEsperado) {
    const body = await esperarStatusEJson(await this.listar(lojaId), 200);
    esperarListaComItem(body, (produto) => produto.id === produtoEsperado.id);
    return body;
  }

  async validarFiltroPorCategoria(lojaId, categoriaId, produtoEsperado) {
    const body = await esperarStatusEJson(await this.listar(lojaId, categoriaId), 200);
    esperarListaComItem(body, (produto) => produto.id === produtoEsperado.id);
    return body;
  }

  async validarDetalhe(produtoId, token, produtoEsperado) {
    const body = await esperarStatusEJson(await this.detalhar(produtoId, token), 200);
    esperarCampos(body, {
      id: produtoEsperado.id,
      lojaId: produtoEsperado.lojaId,
      categoriaId: produtoEsperado.categoriaId,
      nome: produtoEsperado.nome,
    });
    return body;
  }

  async validarAtualizacao(produtoId, payload, token) {
    const body = await esperarStatusEJson(await this.atualizar(produtoId, payload, token), 200);
    esperarCampos(body, {
      id: produtoId,
      categoriaId: payload.categoriaId,
      nome: payload.nome,
      descricao: payload.descricao,
      preco: payload.preco,
      ordem: payload.ordem,
      ativo: payload.ativo,
    });
    return body;
  }

  async validarExclusao(produtoId, token) {
    await esperarStatus(await this.excluir(produtoId, token), 204);
  }

  async validarDuplicidade(payload, token) {
    return esperarErro(await this.criar(payload, token), 422);
  }
}
