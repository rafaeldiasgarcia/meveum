package br.com.meveum.pagamentos.formas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.pagamentos.entity.FormaPagamentoLoja;
import br.com.meveum.pagamentos.formas.dto.ListarFormaPagamentoResponse;
import br.com.meveum.pagamentos.formas.mapper.FormaPagamentoMapper;
import br.com.meveum.pagamentos.repository.FormaPagamentoLojaRepository;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ListarFormaPagamentoServiceTest {

    @Mock
    private ValidarLojaExisteService validarLojaExisteService;
    @Mock
    private FormaPagamentoLojaRepository formaPagamentoLojaRepository;
    @Mock
    private FormaPagamentoMapper formaPagamentoMapper;
    @InjectMocks
    private ListarFormaPagamentoService service;

    @Test
    void deveListarFormasPagamentoDaLoja() {
        var lojaId = UUID.randomUUID();
        var formaPagamento = new FormaPagamentoLoja();
        var response = ListarFormaPagamentoResponse.builder().id(UUID.randomUUID()).lojaId(lojaId).build();
        when(formaPagamentoLojaRepository.findByLojaIdOrderByMethodAsc(lojaId)).thenReturn(List.of(formaPagamento));
        when(formaPagamentoMapper.toListarFormaPagamentoResponse(formaPagamento)).thenReturn(response);

        var resultado = service.listar(lojaId);

        assertThat(resultado).containsExactly(response);
        verify(validarLojaExisteService).validar(lojaId);
    }
}
