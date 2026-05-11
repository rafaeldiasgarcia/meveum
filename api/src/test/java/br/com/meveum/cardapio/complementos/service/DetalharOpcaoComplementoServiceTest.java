package br.com.meveum.cardapio.complementos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.complementos.dto.DetalharOpcaoComplementoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.complementos.validator.service.ValidarOpcaoComplementoExisteService;
import br.com.meveum.cardapio.entity.OpcaoComplemento;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DetalharOpcaoComplementoServiceTest {

    @Mock
    private ValidarOpcaoComplementoExisteService validarOpcaoComplementoExisteService;
    @Mock
    private ComplementoMapper complementoMapper;
    @InjectMocks
    private DetalharOpcaoComplementoService service;

    @Test
    void deveDetalharOpcaoComplemento() {
        var opcaoId = UUID.randomUUID();
        var opcao = new OpcaoComplemento();
        var response = new DetalharOpcaoComplementoResponse(opcaoId, UUID.randomUUID(), UUID.randomUUID(), "Coca", null, BigDecimal.TEN, 1, true);
        when(validarOpcaoComplementoExisteService.validar(opcaoId)).thenReturn(opcao);
        when(complementoMapper.toDetalharOpcaoComplementoResponse(opcao)).thenReturn(response);

        assertThat(service.detalhar(opcaoId)).isEqualTo(response);
    }
}
