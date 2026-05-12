package br.com.meveum.pedidos.validator.service;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.entity.enums.LojaStatus;
import br.com.meveum.shared.exception.RegraNegocioException;
import org.junit.jupiter.api.Test;

class ValidarLojaPedidoDisponivelServiceTest {

    private final ValidarLojaPedidoDisponivelService service = new ValidarLojaPedidoDisponivelService();

    @Test
    void devePermitirLojaAtivaENaoPausada() {
        var loja = new Loja();
        loja.setStatus(LojaStatus.ACTIVE);
        loja.setManuallyPaused(false);

        assertThatCode(() -> service.validar(loja)).doesNotThrowAnyException();
    }

    @Test
    void deveLancarErroQuandoLojaInativa() {
        var loja = new Loja();
        loja.setStatus(LojaStatus.INACTIVE);

        assertThatThrownBy(() -> service.validar(loja))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Loja nao esta ativa para receber pedidos.");
    }

    @Test
    void deveLancarErroQuandoLojaPausada() {
        var loja = new Loja();
        loja.setStatus(LojaStatus.ACTIVE);
        loja.setManuallyPaused(true);

        assertThatThrownBy(() -> service.validar(loja))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Loja esta pausada manualmente.");
    }
}
