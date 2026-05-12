package br.com.meveum.dashboard.validator;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.meveum.shared.exception.RegraNegocioException;
import java.time.OffsetDateTime;
import org.junit.jupiter.api.Test;

class DashboardValidatorTest {

    private final DashboardValidator dashboardValidator = new DashboardValidator();

    @Test
    void deveValidarPeriodoValido() {
        var inicio = OffsetDateTime.now().minusDays(1);
        var fim = OffsetDateTime.now();

        assertThatCode(() -> dashboardValidator.validarPeriodo(inicio, fim)).doesNotThrowAnyException();
    }

    @Test
    void deveLancarErroQuandoInicioNaoInformado() {
        assertThatThrownBy(() -> dashboardValidator.validarPeriodo(null, OffsetDateTime.now()))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Data inicial do dashboard e obrigatoria.");
    }

    @Test
    void deveLancarErroQuandoFimNaoInformado() {
        assertThatThrownBy(() -> dashboardValidator.validarPeriodo(OffsetDateTime.now(), null))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Data final do dashboard e obrigatoria.");
    }

    @Test
    void deveLancarErroQuandoInicioMaiorQueFim() {
        var inicio = OffsetDateTime.now();
        var fim = inicio.minusDays(1);

        assertThatThrownBy(() -> dashboardValidator.validarPeriodo(inicio, fim))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Data inicial do dashboard nao pode ser maior que a final.");
    }

    @Test
    void deveValidarLimiteValido() {
        assertThatCode(() -> dashboardValidator.validarLimite(5)).doesNotThrowAnyException();
    }

    @Test
    void deveLancarErroQuandoLimiteNaoInformado() {
        assertThatThrownBy(() -> dashboardValidator.validarLimite(null))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Limite de produtos do dashboard e obrigatorio.");
    }

    @Test
    void deveLancarErroQuandoLimiteMaiorQueMaximo() {
        assertThatThrownBy(() -> dashboardValidator.validarLimite(51))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Limite de produtos do dashboard deve ser menor ou igual a 50.");
    }
}
