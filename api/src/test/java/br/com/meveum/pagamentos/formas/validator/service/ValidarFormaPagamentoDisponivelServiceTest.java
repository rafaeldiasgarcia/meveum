package br.com.meveum.pagamentos.formas.validator.service;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.pagamentos.entity.enums.FormaPagamento;
import br.com.meveum.pagamentos.repository.FormaPagamentoLojaRepository;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarFormaPagamentoDisponivelServiceTest {

    @Mock
    private FormaPagamentoLojaRepository formaPagamentoLojaRepository;

    @InjectMocks
    private ValidarFormaPagamentoDisponivelService service;

    @Test
    void devePermitirCriacaoQuandoFormaNaoExistirNaLoja() {
        var lojaId = UUID.randomUUID();
        when(formaPagamentoLojaRepository.existsByLojaIdAndMethod(lojaId, FormaPagamento.PIX)).thenReturn(false);

        assertThatCode(() -> service.validarCriacao(lojaId, FormaPagamento.PIX)).doesNotThrowAnyException();
    }

    @Test
    void deveFalharQuandoFormaJaExistirNaLoja() {
        var lojaId = UUID.randomUUID();
        when(formaPagamentoLojaRepository.existsByLojaIdAndMethod(lojaId, FormaPagamento.PIX)).thenReturn(true);

        assertThatThrownBy(() -> service.validarCriacao(lojaId, FormaPagamento.PIX))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Loja ja possui essa forma de pagamento.");
    }

    @Test
    void deveFalharQuandoFormaJaExistirEmOutraLinhaNaAtualizacao() {
        var lojaId = UUID.randomUUID();
        var formaPagamentoId = UUID.randomUUID();
        when(formaPagamentoLojaRepository.existsByLojaIdAndMethodAndIdNot(lojaId, FormaPagamento.PIX, formaPagamentoId))
            .thenReturn(true);

        assertThatThrownBy(() -> service.validarAtualizacao(lojaId, formaPagamentoId, FormaPagamento.PIX))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Loja ja possui essa forma de pagamento.");
    }
}
