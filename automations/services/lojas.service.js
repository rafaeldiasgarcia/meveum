import {
  esperarCampos,
  esperarErro,
  esperarStatus,
  esperarStatusEJson,
} from './contract.service.js';

export class LojasService {
  constructor(request) {
    this.request = request;
  }

  async detalhar(lojaId, token) {
    return this.request.get(`/lojas/${lojaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async detalharPorSlug(slug) {
    return this.request.get(`/lojas/slug/${slug}`);
  }

  async atualizar(lojaId, payload, token) {
    return this.request.put(`/lojas/${lojaId}`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async atualizarPausa(lojaId, payload, token) {
    return this.request.patch(`/lojas/${lojaId}/pausa-manual`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async atualizarStatus(lojaId, payload, token) {
    return this.request.patch(`/lojas/${lojaId}/status`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async validarDetalhesPrivado(lojaId, token, lojaEsperada) {
    const body = await esperarStatusEJson(await this.detalhar(lojaId, token), 200);
    esperarCampos(body, {
      id: lojaEsperada.id,
      nome: lojaEsperada.nome,
      slug: lojaEsperada.slug,
    });
    return body;
  }

  async obterDetalhesPrivados(lojaId, token) {
    return esperarStatusEJson(await this.detalhar(lojaId, token), 200);
  }

  async validarDetalhesPublicos(slug, lojaEsperada) {
    const body = await esperarStatusEJson(await this.detalharPorSlug(slug), 200);
    esperarCampos(body, {
      id: lojaEsperada.id,
      nome: lojaEsperada.nome,
      slug: lojaEsperada.slug,
    });
    return body;
  }

  async validarAtualizacao(lojaId, payload, token) {
    const body = await esperarStatusEJson(await this.atualizar(lojaId, payload, token), 200);
    esperarCampos(body, {
      id: lojaId,
      nome: payload.nome,
      slug: payload.slug,
      whatsappNumber: payload.whatsappNumber,
    });
    return body;
  }

  async validarPausaManual(lojaId, payload, token) {
    const body = await esperarStatusEJson(await this.atualizarPausa(lojaId, payload, token), 200);
    esperarCampos(body, {
      id: lojaId,
      pausadaManualmente: payload.pausadaManualmente,
    });
    return body;
  }

  async validarStatus(lojaId, payload, token) {
    const body = await esperarStatusEJson(await this.atualizarStatus(lojaId, payload, token), 200);
    esperarCampos(body, {
      id: lojaId,
      status: payload.status,
    });
    return body;
  }

  async validarBloqueioSemToken(lojaId) {
    return esperarErro(await this.request.get(`/lojas/${lojaId}`), 401);
  }

  async validarSlugDuplicado(lojaId, payload, token) {
    return esperarErro(await this.atualizar(lojaId, payload, token), 422);
  }

  async validarAcessoNegadoAtualizacao(lojaId, payload, token) {
    return esperarErro(await this.atualizar(lojaId, payload, token), 403);
  }

  async validarSlugInexistente(slug) {
    return esperarErro(await this.detalharPorSlug(slug), 404);
  }
}
