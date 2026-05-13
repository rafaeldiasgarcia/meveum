import {
  esperarCampos,
  esperarErro,
  esperarListaComItem,
  esperarStatus,
  esperarStatusEJson,
} from './contract.service.js';

export class ClientesService {
  constructor(request) {
    this.request = request;
  }

  async criar(payload) {
    return this.request.post('/clientes', { data: payload });
  }

  async listar(lojaId) {
    return this.request.get(`/clientes?lojaId=${lojaId}`);
  }

  async detalhar(clienteId, token) {
    return this.request.get(`/clientes/${clienteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async atualizar(clienteId, payload, token) {
    return this.request.put(`/clientes/${clienteId}`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async criarEndereco(clienteId, payload) {
    return this.request.post(`/clientes/${clienteId}/enderecos`, { data: payload });
  }

  async listarEnderecos(clienteId, token) {
    return this.request.get(`/clientes/${clienteId}/enderecos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async detalharEndereco(clienteId, enderecoId, token) {
    return this.request.get(`/clientes/${clienteId}/enderecos/${enderecoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async atualizarEndereco(clienteId, enderecoId, payload, token) {
    return this.request.put(`/clientes/${clienteId}/enderecos/${enderecoId}`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async excluirEndereco(clienteId, enderecoId, token) {
    return this.request.delete(`/clientes/${clienteId}/enderecos/${enderecoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async validarCriacao(payload) {
    const body = await esperarStatusEJson(await this.criar(payload), 201);
    esperarCampos(body, {
      lojaId: payload.lojaId,
      nome: payload.nome,
      telefone: payload.telefone,
    });
    return body;
  }

  async validarListagem(lojaId, cliente) {
    const body = await esperarStatusEJson(await this.listar(lojaId), 200);
    esperarListaComItem(body, (item) => item.id === cliente.id);
    return body;
  }

  async validarDetalhe(clienteId, cliente, token) {
    const body = await esperarStatusEJson(await this.detalhar(clienteId, token), 200);
    esperarCampos(body, {
      id: cliente.id,
      lojaId: cliente.lojaId,
      nome: cliente.nome,
      telefone: cliente.telefone,
    });
    return body;
  }

  async validarAtualizacao(clienteId, payload, token) {
    const body = await esperarStatusEJson(await this.atualizar(clienteId, payload, token), 200);
    esperarCampos(body, {
      id: clienteId,
      nome: payload.nome,
      telefone: payload.telefone,
    });
    return body;
  }

  async validarCriacaoEndereco(clienteId, payload) {
    const body = await esperarStatusEJson(await this.criarEndereco(clienteId, payload), 201);
    esperarCampos(body, {
      clienteId,
      rua: payload.rua,
      numero: payload.numero,
      bairro: payload.bairro,
      cidade: payload.cidade,
      estado: payload.estado,
    });
    return body;
  }

  async validarListagemEnderecos(clienteId, endereco, token) {
    const body = await esperarStatusEJson(await this.listarEnderecos(clienteId, token), 200);
    esperarListaComItem(body, (item) => item.id === endereco.id);
    return body;
  }

  async validarDetalheEndereco(clienteId, enderecoId, endereco, token) {
    const body = await esperarStatusEJson(await this.detalharEndereco(clienteId, enderecoId, token), 200);
    esperarCampos(body, {
      id: endereco.id,
      clienteId: endereco.clienteId,
      rua: endereco.rua,
      numero: endereco.numero,
    });
    return body;
  }

  async validarAtualizacaoEndereco(clienteId, enderecoId, payload, token) {
    const body = await esperarStatusEJson(
      await this.atualizarEndereco(clienteId, enderecoId, payload, token),
      200
    );
    esperarCampos(body, {
      id: enderecoId,
      clienteId,
      rua: payload.rua,
      numero: payload.numero,
      bairro: payload.bairro,
    });
    return body;
  }

  async validarExclusaoEndereco(clienteId, enderecoId, token) {
    await esperarStatus(await this.excluirEndereco(clienteId, enderecoId, token), 204);
  }

  async validarDuplicidade(payload) {
    return esperarErro(await this.criar(payload), 422);
  }

  async validarEnderecoInvalido(clienteId, payload) {
    return esperarErro(await this.criarEndereco(clienteId, payload), 422);
  }
}
