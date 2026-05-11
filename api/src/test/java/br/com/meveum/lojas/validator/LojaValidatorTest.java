package br.com.meveum.lojas.validator;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.meveum.lojas.dto.AtualizarLojaRequest;
import br.com.meveum.lojas.dto.AtualizarPausaManualLojaRequest;
import br.com.meveum.lojas.dto.AtualizarStatusLojaRequest;
import br.com.meveum.lojas.entity.enums.LojaStatus;
import br.com.meveum.shared.exception.RegraNegocioException;
import org.junit.jupiter.api.Test;

class LojaValidatorTest {

    private final LojaValidator lojaValidator = new LojaValidator();

    @Test
    void deveValidarAtualizacaoValida() {
        var request = new AtualizarLojaRequest("Loja", "loja-teste", null, "5511999999999");

        assertThatCode(() -> lojaValidator.validarAtualizacao(request)).doesNotThrowAnyException();
    }

    @Test
    void deveFalharQuandoNomeNaoForInformado() {
        var request = new AtualizarLojaRequest(" ", "loja-teste", null, "5511999999999");

        assertThatThrownBy(() -> lojaValidator.validarAtualizacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Nome da loja e obrigatorio.");
    }

    @Test
    void deveFalharQuandoSlugNaoForInformado() {
        var request = new AtualizarLojaRequest("Loja", null, null, "5511999999999");

        assertThatThrownBy(() -> lojaValidator.validarAtualizacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Slug da loja e obrigatorio.");
    }

    @Test
    void deveFalharQuandoSlugForInvalido() {
        var request = new AtualizarLojaRequest("Loja", "Loja Teste", null, "5511999999999");

        assertThatThrownBy(() -> lojaValidator.validarAtualizacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Slug da loja deve conter apenas letras minusculas, numeros e hifens.");
    }

    @Test
    void deveFalharQuandoWhatsappNaoForInformado() {
        var request = new AtualizarLojaRequest("Loja", "loja-teste", null, " ");

        assertThatThrownBy(() -> lojaValidator.validarAtualizacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("WhatsApp da loja e obrigatorio.");
    }

    @Test
    void deveFalharQuandoPausaManualNaoForInformada() {
        var request = new AtualizarPausaManualLojaRequest(null);

        assertThatThrownBy(() -> lojaValidator.validarPausaManual(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Pausa manual da loja e obrigatoria.");
    }

    @Test
    void deveFalharQuandoStatusNaoForInformado() {
        var request = new AtualizarStatusLojaRequest(null);

        assertThatThrownBy(() -> lojaValidator.validarStatus(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Status da loja e obrigatorio.");
    }

    @Test
    void deveValidarStatusValido() {
        var request = new AtualizarStatusLojaRequest(LojaStatus.ACTIVE);

        assertThatCode(() -> lojaValidator.validarStatus(request)).doesNotThrowAnyException();
    }
}
