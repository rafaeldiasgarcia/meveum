package br.com.meveum.entrega.areas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import br.com.meveum.entrega.areas.dto.DetalharAreaEntregaResponse;
import br.com.meveum.entrega.areas.mapper.AreaEntregaMapper;
import br.com.meveum.entrega.areas.validator.service.ValidarAreaEntregaExisteService;
import br.com.meveum.entrega.entity.AreaEntregaLoja;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DetalharAreaEntregaServiceTest {

    @Mock
    private ValidarAreaEntregaExisteService validarAreaEntregaExisteService;
    @Mock
    private AreaEntregaMapper areaEntregaMapper;
    @InjectMocks
    private DetalharAreaEntregaService service;

    @Test
    void deveDetalharAreaEntrega() {
        var areaId = UUID.randomUUID();
        var area = new AreaEntregaLoja();
        var response = DetalharAreaEntregaResponse.builder().id(areaId).build();
        when(validarAreaEntregaExisteService.validar(areaId)).thenReturn(area);
        when(areaEntregaMapper.toDetalharAreaEntregaResponse(area)).thenReturn(response);

        assertThat(service.detalhar(areaId)).isEqualTo(response);
    }
}
