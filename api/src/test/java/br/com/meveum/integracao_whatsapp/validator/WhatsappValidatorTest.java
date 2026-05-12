package br.com.meveum.integracao_whatsapp.validator;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.shared.exception.RegraNegocioException;
import org.junit.jupiter.api.Test;

class WhatsappValidatorTest {

    private final WhatsappValidator validator = new WhatsappValidator();

    @Test
    void deveValidarPedidoParaEnvio() {
        var pedido = Pedido.builder()
            .customerPhone("11999999999")
            .whatsappMessage("Mensagem")
            .build();

        assertThatCode(() -> validator.validarPedidoParaEnvio(pedido)).doesNotThrowAnyException();
    }

    @Test
    void deveFalharQuandoTelefoneNaoInformado() {
        var pedido = Pedido.builder()
            .customerPhone(" ")
            .whatsappMessage("Mensagem")
            .build();

        assertThatThrownBy(() -> validator.validarPedidoParaEnvio(pedido))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Telefone do cliente e obrigatorio para envio por WhatsApp.");
    }

    @Test
    void deveFalharQuandoMensagemNaoInformada() {
        var pedido = Pedido.builder()
            .customerPhone("11999999999")
            .whatsappMessage(" ")
            .build();

        assertThatThrownBy(() -> validator.validarPedidoParaEnvio(pedido))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Mensagem de WhatsApp do pedido e obrigatoria.");
    }
}
