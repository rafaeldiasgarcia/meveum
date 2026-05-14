package br.com.meveum.pagamentos.formas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.pagamentos.entity.FormaPagamentoLoja;
import br.com.meveum.pagamentos.entity.enums.FormaPagamento;
import br.com.meveum.pagamentos.formas.dto.AtualizarFormaPagamentoRequest;
import br.com.meveum.pagamentos.formas.dto.AtualizarFormaPagamentoResponse;
import br.com.meveum.pagamentos.formas.mapper.FormaPagamentoMapper;
import br.com.meveum.pagamentos.formas.validator.FormaPagamentoValidator;
import br.com.meveum.pagamentos.formas.validator.service.ValidarFormaPagamentoDisponivelService;
import br.com.meveum.pagamentos.formas.validator.service.ValidarFormaPagamentoExisteService;
import br.com.meveum.pagamentos.repository.FormaPagamentoLojaRepository;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AtualizarFormaPagamentoServiceTest {

    @Mock
    private FormaPagamentoValidator formaPagamentoValidator;
    @Mock
    private ValidarFormaPagamentoExisteService validarFormaPagamentoExisteService;
    @Mock
    private ValidarFormaPagamentoDisponivelService validarFormaPagamentoDisponivelService;
    @Mock
    private FormaPagamentoLojaRepository formaPagamentoLojaRepository;
    @Mock
    private FormaPagamentoMapper formaPagamentoMapper;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;

    @InjectMocks
    private AtualizarFormaPagamentoService service;

    @Test
    void deveAtualizarFormaPagamento() {
        var lojaId = UUID.randomUUID();
        var formaPagamentoId = UUID.randomUUID();
        var request = new AtualizarFormaPagamentoRequest(FormaPagamento.CASH, false);
        var loja = new Loja();
        loja.setId(lojaId);
        var formaPagamento = new FormaPagamentoLoja();
        formaPagamento.setLoja(loja);
        var response = AtualizarFormaPagamentoResponse.builder().id(formaPagamentoId).lojaId(lojaId).build();
        when(validarFormaPagamentoExisteService.validar(formaPagamentoId)).thenReturn(formaPagamento);
        when(formaPagamentoLojaRepository.save(formaPagamento)).thenReturn(formaPagamento);
        when(formaPagamentoMapper.toAtualizarFormaPagamentoResponse(formaPagamento)).thenReturn(response);

        var resultado = service.atualizar(formaPagamentoId, request);

        assertThat(resultado).isEqualTo(response);
        verify(formaPagamentoValidator).validarAtualizacao(request);
        verify(validarFormaPagamentoDisponivelService).validarAtualizacao(lojaId, formaPagamentoId, FormaPagamento.CASH);
        verify(formaPagamentoMapper).toEntity(request, formaPagamento);
    }
}
