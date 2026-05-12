package br.com.meveum.pedidos.validator.service;

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
class ValidarPagamentoPedidoServiceTest {

    @Mock
    private FormaPagamentoLojaRepository formaPagamentoLojaRepository;
    @InjectMocks
    private ValidarPagamentoPedidoService service;

    @Test
    void devePermitirFormaPagamentoAtiva() {
        var lojaId = UUID.randomUUID();
        when(formaPagamentoLojaRepository.existsByLojaIdAndMethodAndActiveTrue(lojaId, FormaPagamento.PIX)).thenReturn(true);

        assertThatCode(() -> service.validar(lojaId, FormaPagamento.PIX)).doesNotThrowAnyException();
    }

    @Test
    void deveLancarErroQuandoFormaPagamentoNaoAtiva() {
        var lojaId = UUID.randomUUID();
        when(formaPagamentoLojaRepository.existsByLojaIdAndMethodAndActiveTrue(lojaId, FormaPagamento.PIX)).thenReturn(false);

        assertThatThrownBy(() -> service.validar(lojaId, FormaPagamento.PIX))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Forma de pagamento nao esta ativa para a loja.");
    }
}
