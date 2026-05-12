package br.com.meveum.integracao_whatsapp.mapper;

import br.com.meveum.integracao_whatsapp.dto.ObterMensagemWhatsappPedidoResponse;
import br.com.meveum.pedidos.entity.Pedido;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.springframework.stereotype.Component;

@Component
public class WhatsappMapper {

    public ObterMensagemWhatsappPedidoResponse toObterMensagemWhatsappPedidoResponse(Pedido pedido) {
        return ObterMensagemWhatsappPedidoResponse.builder()
            .pedidoId(pedido.getId())
            .lojaId(pedido.getLoja().getId())
            .status(pedido.getStatus())
            .telefoneDestino(pedido.getCustomerPhone())
            .mensagem(pedido.getWhatsappMessage())
            .urlEnvio(toUrlEnvio(pedido))
            .build();
    }

    private String toUrlEnvio(Pedido pedido) {
        var telefone = somenteDigitos(pedido.getCustomerPhone());
        var mensagem = URLEncoder.encode(pedido.getWhatsappMessage(), StandardCharsets.UTF_8);
        return "https://wa.me/" + telefone + "?text=" + mensagem;
    }

    private String somenteDigitos(String valor) {
        return valor == null ? "" : valor.replaceAll("\\D", "");
    }
}
