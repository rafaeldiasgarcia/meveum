package br.com.meveum.pagamentos.formas.validator;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.meveum.pagamentos.entity.enums.FormaPagamento;
import br.com.meveum.pagamentos.formas.dto.AtualizarFormaPagamentoRequest;
import br.com.meveum.pagamentos.formas.dto.CriarFormaPagamentoRequest;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class FormaPagamentoValidatorTest {

    private final FormaPagamentoValidator formaPagamentoValidator = new FormaPagamentoValidator();

    @Test
    void deveValidarCriacaoValida() {
        var request = new CriarFormaPagamentoRequest(UUID.randomUUID(), FormaPagamento.PIX);

        assertThatCode(() -> formaPagamentoValidator.validarCriacao(request)).doesNotThrowAnyException();
    }

    @Test
    void deveFalharQuandoFormaPagamentoNaoForInformadaNaCriacao() {
        var request = new CriarFormaPagamentoRequest(UUID.randomUUID(), null);

        assertThatThrownBy(() -> formaPagamentoValidator.validarCriacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Forma de pagamento e obrigatoria.");
    }

    @Test
    void deveFalharQuandoFormaPagamentoNaoForInformadaNaAtualizacao() {
        var request = new AtualizarFormaPagamentoRequest(null, true);

        assertThatThrownBy(() -> formaPagamentoValidator.validarAtualizacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Forma de pagamento e obrigatoria.");
    }

    @Test
    void deveFalharQuandoAtivoNaoForInformadoNaAtualizacao() {
        var request = new AtualizarFormaPagamentoRequest(FormaPagamento.PIX, null);

        assertThatThrownBy(() -> formaPagamentoValidator.validarAtualizacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Status ativo da forma de pagamento e obrigatorio.");
    }
}
