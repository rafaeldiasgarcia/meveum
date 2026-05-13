import { expect } from '@playwright/test';
import {
  esperarCampos,
  esperarErro,
  esperarListaComItem,
  esperarStatusEJson,
} from './contract.service.js';

export class PedidosService {
  constructor(request) {
    this.request = request;
  }

  async criar(payload) {
    return this.request.post('/pedidos', { data: payload });
  }

  async listar(lojaId, token, status = null) {
    const query = status ? `/pedidos?lojaId=${lojaId}&status=${status}` : `/pedidos?lojaId=${lojaId}`;
    return this.request.get(query, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async detalhar(pedidoId, token) {
    return this.request.get(`/pedidos/${pedidoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async atualizarStatus(pedidoId, payload, token) {
    return this.request.patch(`/pedidos/${pedidoId}/status`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async validarCriacao(payload) {
    const body = await esperarStatusEJson(await this.criar(payload), 201);
    esperarCampos(body, {
      lojaId: payload.lojaId,
      nomeCliente: payload.nomeCliente,
      telefoneCliente: payload.telefoneCliente,
      tipoRecebimento: payload.tipoRecebimento,
      formaPagamento: payload.formaPagamento,
      status: 'NEW',
    });
    expect(body.itens.length).toBe(payload.itens.length);
    expect(Number(body.total)).toBeGreaterThan(0);
    return body;
  }

  async validarListagem(lojaId, token, pedido) {
    const body = await esperarStatusEJson(await this.listar(lojaId, token), 200);
    esperarListaComItem(body, (item) => item.id === pedido.id);
    return body;
  }

  async validarFiltroStatus(lojaId, token, pedido, status) {
    const body = await esperarStatusEJson(await this.listar(lojaId, token, status), 200);
    esperarListaComItem(body, (item) => item.id === pedido.id && item.status === status);
    return body;
  }

  async validarDetalhe(pedidoId, token, pedido) {
    const body = await esperarStatusEJson(await this.detalhar(pedidoId, token), 200);
    esperarCampos(body, {
      id: pedido.id,
      lojaId: pedido.lojaId,
      nomeCliente: pedido.nomeCliente,
      status: pedido.status,
    });
    expect(body.itens.length).toBe(pedido.itens.length);
    return body;
  }

  async validarAtualizacaoStatus(pedidoId, payload, token) {
    const body = await esperarStatusEJson(await this.atualizarStatus(pedidoId, payload, token), 200);
    esperarCampos(body, {
      id: pedidoId,
      status: payload.status,
    });
    return body;
  }

  async validarPedidoInvalido(payload) {
    return esperarErro(await this.criar(payload), 422);
  }

  async validarAcessoNegadoListagem(lojaId, token) {
    return esperarErro(await this.listar(lojaId, token), 403);
  }
}
