package br.com.meveum.lojas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.lojas.dto.DetalharLojaResponse;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.mapper.LojaMapper;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DetalharLojaServiceTest {

    @Mock
    private ValidarLojaExisteService validarLojaExisteService;
    @Mock
    private LojaMapper lojaMapper;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;

    @InjectMocks
    private DetalharLojaService service;

    @Test
    void deveDetalharLoja() {
        var lojaId = UUID.randomUUID();
        var loja = new Loja();
        var response = DetalharLojaResponse.builder().id(lojaId).build();
        when(validarLojaExisteService.validar(lojaId)).thenReturn(loja);
        when(lojaMapper.toDetalharLojaResponse(loja)).thenReturn(response);

        assertThat(service.detalhar(lojaId)).isEqualTo(response);
    }
}
