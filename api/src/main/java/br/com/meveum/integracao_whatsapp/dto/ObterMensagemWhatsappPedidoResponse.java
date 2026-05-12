package br.com.meveum.integracao_whatsapp.dto;

import br.com.meveum.pedidos.entity.enums.StatusPedido;
import java.util.UUID;
import lombok.Builder;

@Builder
public record ObterMensagemWhatsappPedidoResponse(
    UUID pedidoId,
    UUID lojaId,
    StatusPedido status,
    String telefoneDestino,
    String mensagem,
    String urlEnvio
) {
}
