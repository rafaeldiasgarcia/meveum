package br.com.meveum.entrega.areas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.entrega.areas.dto.AtualizarAreaEntregaRequest;
import br.com.meveum.entrega.areas.dto.AtualizarAreaEntregaResponse;
import br.com.meveum.entrega.areas.mapper.AreaEntregaMapper;
import br.com.meveum.entrega.areas.validator.AreaEntregaValidator;
import br.com.meveum.entrega.areas.validator.service.ValidarAreaEntregaExisteService;
import br.com.meveum.entrega.entity.AreaEntregaLoja;
import br.com.meveum.entrega.entity.enums.TipoAreaEntrega;
import br.com.meveum.entrega.repository.AreaEntregaLojaRepository;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AtualizarAreaEntregaServiceTest {

    @Mock
    private AreaEntregaValidator areaEntregaValidator;
    @Mock
    private ValidarAreaEntregaExisteService validarAreaEntregaExisteService;
    @Mock
    private AreaEntregaLojaRepository areaEntregaLojaRepository;
    @Mock
    private AreaEntregaMapper areaEntregaMapper;
    @InjectMocks
    private AtualizarAreaEntregaService service;

    @Test
    void deveAtualizarAreaEntrega() {
        var areaId = UUID.randomUUID();
        var request = new AtualizarAreaEntregaRequest("Centro", TipoAreaEntrega.NEIGHBORHOOD, "Centro", null, null, null, BigDecimal.TEN, null, 30, true);
        var area = new AreaEntregaLoja();
        var response = AtualizarAreaEntregaResponse.builder().id(areaId).build();
        when(validarAreaEntregaExisteService.validar(areaId)).thenReturn(area);
        when(areaEntregaLojaRepository.save(area)).thenReturn(area);
        when(areaEntregaMapper.toAtualizarAreaEntregaResponse(area)).thenReturn(response);

        var resultado = service.atualizar(areaId, request);

        assertThat(resultado).isEqualTo(response);
        verify(areaEntregaValidator).validarAtualizacao(request);
        verify(areaEntregaMapper).toEntity(request, area);
    }
}
