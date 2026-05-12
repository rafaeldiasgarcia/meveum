package br.com.meveum.pagamentos.formas.validator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.pagamentos.entity.FormaPagamentoLoja;
import br.com.meveum.pagamentos.repository.FormaPagamentoLojaRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarFormaPagamentoExisteServiceTest {

    @Mock
    private FormaPagamentoLojaRepository formaPagamentoLojaRepository;

    @InjectMocks
    private ValidarFormaPagamentoExisteService service;

    @Test
    void deveRetornarFormaPagamentoQuandoExistir() {
        var id = UUID.randomUUID();
        var formaPagamento = new FormaPagamentoLoja();
        when(formaPagamentoLojaRepository.findById(id)).thenReturn(Optional.of(formaPagamento));

        assertThat(service.validar(id)).isEqualTo(formaPagamento);
    }

    @Test
    void deveFalharQuandoFormaPagamentoNaoExistir() {
        var id = UUID.randomUUID();
        when(formaPagamentoLojaRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.validar(id))
            .isInstanceOf(RecursoNaoEncontradoException.class)
            .hasMessage("Forma de pagamento nao encontrada.");
    }
}
