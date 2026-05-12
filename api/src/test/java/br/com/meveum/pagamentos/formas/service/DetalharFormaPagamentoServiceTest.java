package br.com.meveum.pagamentos.formas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import br.com.meveum.pagamentos.entity.FormaPagamentoLoja;
import br.com.meveum.pagamentos.formas.dto.DetalharFormaPagamentoResponse;
import br.com.meveum.pagamentos.formas.mapper.FormaPagamentoMapper;
import br.com.meveum.pagamentos.formas.validator.service.ValidarFormaPagamentoExisteService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DetalharFormaPagamentoServiceTest {

    @Mock
    private ValidarFormaPagamentoExisteService validarFormaPagamentoExisteService;
    @Mock
    private FormaPagamentoMapper formaPagamentoMapper;
    @InjectMocks
    private DetalharFormaPagamentoService service;

    @Test
    void deveDetalharFormaPagamento() {
        var formaPagamentoId = UUID.randomUUID();
        var formaPagamento = new FormaPagamentoLoja();
        var response = DetalharFormaPagamentoResponse.builder().id(formaPagamentoId).build();
        when(validarFormaPagamentoExisteService.validar(formaPagamentoId)).thenReturn(formaPagamento);
        when(formaPagamentoMapper.toDetalharFormaPagamentoResponse(formaPagamento)).thenReturn(response);

        assertThat(service.detalhar(formaPagamentoId)).isEqualTo(response);
    }
}
