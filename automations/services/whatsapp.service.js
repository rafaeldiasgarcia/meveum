import {
  esperarCampos,
  esperarCamposPresentes,
  esperarStatusEJson,
} from './contract.service.js';

export class WhatsappService {
  constructor(request) {
    this.request = request;
  }

  async obterMensagem(pedidoId) {
    return this.request.get(`/integracoes/whatsapp/pedidos/${pedidoId}/mensagem`);
  }

  async validarMensagem(pedido) {
    const body = await esperarStatusEJson(await this.obterMensagem(pedido.id), 200);
    esperarCampos(body, {
      pedidoId: pedido.id,
      lojaId: pedido.lojaId,
      status: pedido.status,
    });
    esperarCamposPresentes(body, ['telefoneDestino', 'mensagem', 'urlEnvio']);
    return body;
  }
}
