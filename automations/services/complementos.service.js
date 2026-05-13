import {
  esperarCampos,
  esperarErro,
  esperarListaComItem,
  esperarStatus,
  esperarStatusEJson,
} from './contract.service.js';

export class ComplementosService {
  constructor(request) {
    this.request = request;
  }

  async criarGrupo(payload, token) {
    return this.request.post('/complementos/grupos', {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async listarGrupos(lojaId, token) {
    return this.request.get(`/complementos/grupos?lojaId=${lojaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async detalharGrupo(grupoId, token) {
    return this.request.get(`/complementos/grupos/${grupoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async atualizarGrupo(grupoId, payload, token) {
    return this.request.put(`/complementos/grupos/${grupoId}`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async excluirGrupo(grupoId, token) {
    return this.request.delete(`/complementos/grupos/${grupoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async criarOpcao(payload, token) {
    return this.request.post('/complementos/opcoes', {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async listarOpcoes(grupoId) {
    return this.request.get(`/complementos/opcoes?grupoComplementoId=${grupoId}`);
  }

  async detalharOpcao(opcaoId, token) {
    return this.request.get(`/complementos/opcoes/${opcaoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async atualizarOpcao(opcaoId, payload, token) {
    return this.request.put(`/complementos/opcoes/${opcaoId}`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async excluirOpcao(opcaoId, token) {
    return this.request.delete(`/complementos/opcoes/${opcaoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async vincularGrupo(produtoId, payload, token) {
    return this.request.post(`/complementos/produtos/${produtoId}/grupos`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async listarGruposProduto(produtoId) {
    return this.request.get(`/complementos/produtos/${produtoId}/grupos`);
  }

  async desvincularGrupo(produtoId, grupoId, token) {
    return this.request.delete(`/complementos/produtos/${produtoId}/grupos/${grupoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async validarCriacaoGrupo(payload, token) {
    const body = await esperarStatusEJson(await this.criarGrupo(payload, token), 201);
    esperarCampos(body, {
      lojaId: payload.lojaId,
      nome: payload.nome,
      quantidadeMinima: payload.quantidadeMinima,
      quantidadeMaxima: payload.quantidadeMaxima,
      ordem: payload.ordem,
      ativo: true,
    });
    return body;
  }

  async validarListagemGrupo(lojaId, grupo, token) {
    const body = await esperarStatusEJson(await this.listarGrupos(lojaId, token), 200);
    esperarListaComItem(body, (item) => item.id === grupo.id);
    return body;
  }

  async validarDetalheGrupo(grupoId, grupo, token) {
    const body = await esperarStatusEJson(await this.detalharGrupo(grupoId, token), 200);
    esperarCampos(body, {
      id: grupo.id,
      lojaId: grupo.lojaId,
      nome: grupo.nome,
    });
    return body;
  }

  async validarAtualizacaoGrupo(grupoId, payload, token) {
    const body = await esperarStatusEJson(await this.atualizarGrupo(grupoId, payload, token), 200);
    esperarCampos(body, {
      id: grupoId,
      nome: payload.nome,
      quantidadeMinima: payload.quantidadeMinima,
      quantidadeMaxima: payload.quantidadeMaxima,
      ativo: payload.ativo,
    });
    return body;
  }

  async validarExclusaoGrupo(grupoId, token) {
    await esperarStatus(await this.excluirGrupo(grupoId, token), 204);
  }

  async validarCriacaoOpcao(payload, token) {
    const body = await esperarStatusEJson(await this.criarOpcao(payload, token), 201);
    esperarCampos(body, {
      lojaId: payload.lojaId,
      grupoComplementoId: payload.grupoComplementoId,
      nome: payload.nome,
      precoAdicional: payload.precoAdicional,
      ordem: payload.ordem,
      ativo: true,
    });
    return body;
  }

  async validarListagemOpcao(grupoId, opcao) {
    const body = await esperarStatusEJson(await this.listarOpcoes(grupoId), 200);
    esperarListaComItem(body, (item) => item.id === opcao.id);
    return body;
  }

  async validarDetalheOpcao(opcaoId, opcao, token) {
    const body = await esperarStatusEJson(await this.detalharOpcao(opcaoId, token), 200);
    esperarCampos(body, {
      id: opcao.id,
      lojaId: opcao.lojaId,
      grupoComplementoId: opcao.grupoComplementoId,
      nome: opcao.nome,
    });
    return body;
  }

  async validarAtualizacaoOpcao(opcaoId, payload, token) {
    const body = await esperarStatusEJson(await this.atualizarOpcao(opcaoId, payload, token), 200);
    esperarCampos(body, {
      id: opcaoId,
      nome: payload.nome,
      precoAdicional: payload.precoAdicional,
      ativo: payload.ativo,
    });
    return body;
  }

  async validarExclusaoOpcao(opcaoId, token) {
    await esperarStatus(await this.excluirOpcao(opcaoId, token), 204);
  }

  async validarVinculoProduto(produtoId, payload, token) {
    const body = await esperarStatusEJson(await this.vincularGrupo(produtoId, payload, token), 201);
    esperarCampos(body, {
      produtoId,
      grupoComplementoId: payload.grupoComplementoId,
      ordem: payload.ordem,
      ativo: true,
    });
    return body;
  }

  async validarListagemProduto(produtoId, vinculo) {
    const body = await esperarStatusEJson(await this.listarGruposProduto(produtoId), 200);
    esperarListaComItem(body, (item) => item.id === vinculo.id);
    return body;
  }

  async validarDesvinculo(produtoId, grupoId, token) {
    await esperarStatus(await this.desvincularGrupo(produtoId, grupoId, token), 204);
  }

  async validarDuplicidadeVinculo(produtoId, payload, token) {
    return esperarErro(await this.vincularGrupo(produtoId, payload, token), 422);
  }
}
