package br.com.meveum.pagamentos.formas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.pagamentos.entity.FormaPagamentoLoja;
import br.com.meveum.pagamentos.formas.validator.service.ValidarFormaPagamentoExisteService;
import br.com.meveum.pagamentos.repository.FormaPagamentoLojaRepository;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExcluirFormaPagamentoServiceTest {

    @Mock
    private ValidarFormaPagamentoExisteService validarFormaPagamentoExisteService;
    @Mock
    private FormaPagamentoLojaRepository formaPagamentoLojaRepository;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;

    @InjectMocks
    private ExcluirFormaPagamentoService service;

    @Test
    void deveInativarFormaPagamento() {
        var formaPagamentoId = UUID.randomUUID();
        var loja = new Loja();
        loja.setId(UUID.randomUUID());
        var formaPagamento = new FormaPagamentoLoja();
        formaPagamento.setLoja(loja);
        formaPagamento.setActive(true);
        when(validarFormaPagamentoExisteService.validar(formaPagamentoId)).thenReturn(formaPagamento);

        service.excluir(formaPagamentoId);

        assertThat(formaPagamento.getActive()).isFalse();
        verify(formaPagamentoLojaRepository).save(formaPagamento);
    }
}
