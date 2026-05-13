package br.com.meveum.lojas.validator;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.meveum.lojas.dto.AtualizarHorarioFuncionamentoRequest;
import br.com.meveum.lojas.dto.AtualizarLojaRequest;
import br.com.meveum.lojas.dto.AtualizarPausaManualLojaRequest;
import br.com.meveum.lojas.dto.AtualizarStatusLojaRequest;
import br.com.meveum.lojas.entity.enums.LojaStatus;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.time.LocalTime;
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

    @Test
    void deveValidarHorarioFuncionamentoValido() {
        var request = new AtualizarHorarioFuncionamentoRequest(
            (short) 1,
            LocalTime.of(8, 0),
            LocalTime.of(18, 0),
            true
        );

        assertThatCode(() -> lojaValidator.validarHorarioFuncionamento(request)).doesNotThrowAnyException();
    }

    @Test
    void deveFalharQuandoDiaDaSemanaDoHorarioForInvalido() {
        var request = new AtualizarHorarioFuncionamentoRequest(
            (short) 8,
            LocalTime.of(8, 0),
            LocalTime.of(18, 0),
            true
        );

        assertThatThrownBy(() -> lojaValidator.validarHorarioFuncionamento(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Dia da semana do horario e invalido.");
    }

    @Test
    void deveFalharQuandoFechamentoNaoForMaiorQueAbertura() {
        var request = new AtualizarHorarioFuncionamentoRequest(
            (short) 1,
            LocalTime.of(18, 0),
            LocalTime.of(18, 0),
            true
        );

        assertThatThrownBy(() -> lojaValidator.validarHorarioFuncionamento(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Horario de fechamento deve ser maior que abertura.");
    }
}
