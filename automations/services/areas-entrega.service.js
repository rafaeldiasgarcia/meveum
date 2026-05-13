import {
  esperarCampos,
  esperarErro,
  esperarListaComItem,
  esperarStatus,
  esperarStatusEJson,
} from './contract.service.js';

export class AreasEntregaService {
  constructor(request) {
    this.request = request;
  }

  async criar(payload, token) {
    return this.request.post('/entrega/areas', {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async listar(lojaId) {
    return this.request.get(`/entrega/areas?lojaId=${lojaId}`);
  }

  async detalhar(areaId, token) {
    return this.request.get(`/entrega/areas/${areaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async atualizar(areaId, payload, token) {
    return this.request.put(`/entrega/areas/${areaId}`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async excluir(areaId, token) {
    return this.request.delete(`/entrega/areas/${areaId}`, {
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
      tipo: payload.tipo,
      bairro: payload.bairro,
      taxa: payload.taxa,
      pedidoMinimo: payload.pedidoMinimo,
      tempoEstimadoMinutos: payload.tempoEstimadoMinutos,
      ativo: true,
    });
    return body;
  }

  async validarListagem(lojaId, area) {
    const body = await esperarStatusEJson(await this.listar(lojaId), 200);
    esperarListaComItem(body, (item) => item.id === area.id);
    return body;
  }

  async validarDetalhe(areaId, area, token) {
    const body = await esperarStatusEJson(await this.detalhar(areaId, token), 200);
    esperarCampos(body, {
      id: area.id,
      lojaId: area.lojaId,
      nome: area.nome,
      tipo: area.tipo,
    });
    return body;
  }

  async validarAtualizacao(areaId, payload, token) {
    const body = await esperarStatusEJson(await this.atualizar(areaId, payload, token), 200);
    esperarCampos(body, {
      id: areaId,
      nome: payload.nome,
      bairro: payload.bairro,
      taxa: payload.taxa,
      pedidoMinimo: payload.pedidoMinimo,
      tempoEstimadoMinutos: payload.tempoEstimadoMinutos,
      ativo: payload.ativo,
    });
    return body;
  }

  async validarExclusao(areaId, token) {
    await esperarStatus(await this.excluir(areaId, token), 204);
  }

  async validarAreaInvalida(payload, token) {
    return esperarErro(await this.criar(payload, token), 422);
  }
}
