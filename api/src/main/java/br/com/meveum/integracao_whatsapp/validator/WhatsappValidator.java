package br.com.meveum.integracao_whatsapp.validator;

import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.shared.exception.RegraNegocioException;
import org.springframework.stereotype.Component;

@Component
public class WhatsappValidator {

    public void validarPedidoParaEnvio(Pedido pedido) {
        if (pedido.getCustomerPhone() == null || pedido.getCustomerPhone().isBlank()) {
            throw new RegraNegocioException("Telefone do cliente e obrigatorio para envio por WhatsApp.");
        }

        if (pedido.getWhatsappMessage() == null || pedido.getWhatsappMessage().isBlank()) {
            throw new RegraNegocioException("Mensagem de WhatsApp do pedido e obrigatoria.");
        }
    }
}
