package br.com.meveum.pagamentos.formas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.pagamentos.entity.FormaPagamentoLoja;
import br.com.meveum.pagamentos.entity.enums.FormaPagamento;
import br.com.meveum.pagamentos.formas.dto.CriarFormaPagamentoRequest;
import br.com.meveum.pagamentos.formas.dto.CriarFormaPagamentoResponse;
import br.com.meveum.pagamentos.formas.mapper.FormaPagamentoMapper;
import br.com.meveum.pagamentos.formas.validator.FormaPagamentoValidator;
import br.com.meveum.pagamentos.formas.validator.service.ValidarFormaPagamentoDisponivelService;
import br.com.meveum.pagamentos.repository.FormaPagamentoLojaRepository;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CriarFormaPagamentoServiceTest {

    @Mock
    private FormaPagamentoValidator formaPagamentoValidator;
    @Mock
    private ValidarLojaExisteService validarLojaExisteService;
    @Mock
    private ValidarFormaPagamentoDisponivelService validarFormaPagamentoDisponivelService;
    @Mock
    private FormaPagamentoLojaRepository formaPagamentoLojaRepository;
    @Mock
    private FormaPagamentoMapper formaPagamentoMapper;
    @InjectMocks
    private CriarFormaPagamentoService service;

    @Test
    void deveCriarFormaPagamento() {
        var lojaId = UUID.randomUUID();
        var request = new CriarFormaPagamentoRequest(lojaId, FormaPagamento.PIX);
        var loja = new Loja();
        var formaPagamento = new FormaPagamentoLoja();
        var response = CriarFormaPagamentoResponse.builder().id(UUID.randomUUID()).lojaId(lojaId).build();
        when(validarLojaExisteService.validar(lojaId)).thenReturn(loja);
        when(formaPagamentoMapper.toEntity(request)).thenReturn(formaPagamento);
        when(formaPagamentoLojaRepository.save(formaPagamento)).thenReturn(formaPagamento);
        when(formaPagamentoMapper.toCriarFormaPagamentoResponse(formaPagamento)).thenReturn(response);

        var resultado = service.criar(request);

        assertThat(resultado).isEqualTo(response);
        assertThat(formaPagamento.getLoja()).isEqualTo(loja);
        verify(formaPagamentoValidator).validarCriacao(request);
        verify(validarFormaPagamentoDisponivelService).validarCriacao(lojaId, FormaPagamento.PIX);
    }
}
