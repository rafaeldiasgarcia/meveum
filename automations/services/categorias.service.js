import {
  esperarCampos,
  esperarErro,
  esperarListaComItem,
  esperarStatus,
  esperarStatusEJson,
} from './contract.service.js';

export class CategoriasService {
  constructor(request) {
    this.request = request;
  }

  async criar(payload, token) {
    return this.request.post('/categorias', {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async listar(lojaId) {
    return this.request.get(`/categorias?lojaId=${lojaId}`);
  }

  async detalhar(categoriaId, token) {
    return this.request.get(`/categorias/${categoriaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async atualizar(categoriaId, payload, token) {
    return this.request.put(`/categorias/${categoriaId}`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async excluir(categoriaId, token) {
    return this.request.delete(`/categorias/${categoriaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async validarCriacao(payload, token) {
    const body = await esperarStatusEJson(await this.criar(payload, token), 201);
    esperarCampos(body, {
      lojaId: payload.lojaId,
      nome: payload.nome,
      descricao: payload.descricao,
      ordem: payload.ordem,
      ativo: true,
    });
    return body;
  }

  async validarListagem(lojaId, categoriaEsperada) {
    const body = await esperarStatusEJson(await this.listar(lojaId), 200);
    esperarListaComItem(body, (categoria) => categoria.id === categoriaEsperada.id);
    return body;
  }

  async validarDetalhe(categoriaId, token, categoriaEsperada) {
    const body = await esperarStatusEJson(await this.detalhar(categoriaId, token), 200);
    esperarCampos(body, {
      id: categoriaEsperada.id,
      lojaId: categoriaEsperada.lojaId,
      nome: categoriaEsperada.nome,
    });
    return body;
  }

  async validarAtualizacao(categoriaId, payload, token) {
    const body = await esperarStatusEJson(await this.atualizar(categoriaId, payload, token), 200);
    esperarCampos(body, {
      id: categoriaId,
      nome: payload.nome,
      descricao: payload.descricao,
      ordem: payload.ordem,
      ativo: payload.ativo,
    });
    return body;
  }

  async validarExclusao(categoriaId, token) {
    await esperarStatus(await this.excluir(categoriaId, token), 204);
  }

  async validarDuplicidade(payload, token) {
    return esperarErro(await this.criar(payload, token), 422);
  }

  async validarBloqueioSemToken(payload) {
    return esperarErro(await this.request.post('/categorias', { data: payload }), 401);
  }

  async validarAcessoNegadoDetalhe(categoriaId, token) {
    return esperarErro(await this.detalhar(categoriaId, token), 403);
  }
}
