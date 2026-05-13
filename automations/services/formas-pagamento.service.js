import {
  esperarCampos,
  esperarErro,
  esperarListaComItem,
  esperarStatus,
  esperarStatusEJson,
} from './contract.service.js';

export class FormasPagamentoService {
  constructor(request) {
    this.request = request;
  }

  async criar(payload, token) {
    return this.request.post('/pagamentos/formas', {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async listar(lojaId) {
    return this.request.get(`/pagamentos/formas?lojaId=${lojaId}`);
  }

  async detalhar(formaId, token) {
    return this.request.get(`/pagamentos/formas/${formaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async atualizar(formaId, payload, token) {
    return this.request.put(`/pagamentos/formas/${formaId}`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async excluir(formaId, token) {
    return this.request.delete(`/pagamentos/formas/${formaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async validarCriacao(payload, token) {
    const body = await esperarStatusEJson(await this.criar(payload, token), 201);
    esperarCampos(body, {
      lojaId: payload.lojaId,
      formaPagamento: payload.formaPagamento,
      ativo: true,
    });
    return body;
  }

  async validarListagem(lojaId, forma) {
    const body = await esperarStatusEJson(await this.listar(lojaId), 200);
    esperarListaComItem(body, (item) => item.id === forma.id);
    return body;
  }

  async validarDetalhe(formaId, forma, token) {
    const body = await esperarStatusEJson(await this.detalhar(formaId, token), 200);
    esperarCampos(body, {
      id: forma.id,
      lojaId: forma.lojaId,
      formaPagamento: forma.formaPagamento,
    });
    return body;
  }

  async validarAtualizacao(formaId, payload, token) {
    const body = await esperarStatusEJson(await this.atualizar(formaId, payload, token), 200);
    esperarCampos(body, {
      id: formaId,
      formaPagamento: payload.formaPagamento,
      ativo: payload.ativo,
    });
    return body;
  }

  async validarExclusao(formaId, token) {
    await esperarStatus(await this.excluir(formaId, token), 204);
  }

  async validarDuplicidade(payload, token) {
    return esperarErro(await this.criar(payload, token), 422);
  }
}
