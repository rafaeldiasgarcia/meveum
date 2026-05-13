import {
  esperarCampos,
  esperarErro,
  esperarListaNaoVazia,
  esperarStatusEJson,
} from './contract.service.js';

export class DashboardService {
  constructor(request) {
    this.request = request;
  }

  async resumo(lojaId, periodo, token) {
    return this.request.get(
      `/dashboard/resumo?lojaId=${lojaId}&inicio=${encodeURIComponent(periodo.inicio)}&fim=${encodeURIComponent(periodo.fim)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  async produtosMaisVendidos(lojaId, periodo, token) {
    return this.request.get(
      `/dashboard/produtos-mais-vendidos?lojaId=${lojaId}&inicio=${encodeURIComponent(periodo.inicio)}&fim=${encodeURIComponent(periodo.fim)}&limite=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  async validarResumo(lojaId, periodo, token) {
    const body = await esperarStatusEJson(await this.resumo(lojaId, periodo, token), 200);
    esperarCampos(body, { lojaId });
    return body;
  }

  async validarRanking(lojaId, periodo, token) {
    const body = await esperarStatusEJson(await this.produtosMaisVendidos(lojaId, periodo, token), 200);
    esperarListaNaoVazia(body);
    return body;
  }

  async validarAcessoNegadoResumo(lojaId, periodo, token) {
    return esperarErro(await this.resumo(lojaId, periodo, token), 403);
  }
}
