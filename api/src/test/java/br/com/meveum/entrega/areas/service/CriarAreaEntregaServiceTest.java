package br.com.meveum.entrega.areas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.entrega.areas.dto.CriarAreaEntregaRequest;
import br.com.meveum.entrega.areas.dto.CriarAreaEntregaResponse;
import br.com.meveum.entrega.areas.mapper.AreaEntregaMapper;
import br.com.meveum.entrega.areas.validator.AreaEntregaValidator;
import br.com.meveum.entrega.entity.AreaEntregaLoja;
import br.com.meveum.entrega.entity.enums.TipoAreaEntrega;
import br.com.meveum.entrega.repository.AreaEntregaLojaRepository;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CriarAreaEntregaServiceTest {

    @Mock
    private AreaEntregaValidator areaEntregaValidator;
    @Mock
    private ValidarLojaExisteService validarLojaExisteService;
    @Mock
    private AreaEntregaLojaRepository areaEntregaLojaRepository;
    @Mock
    private AreaEntregaMapper areaEntregaMapper;
    @InjectMocks
    private CriarAreaEntregaService service;

    @Test
    void deveCriarAreaEntrega() {
        var lojaId = UUID.randomUUID();
        var request = new CriarAreaEntregaRequest(lojaId, "Centro", TipoAreaEntrega.NEIGHBORHOOD, "Centro", null, null, null, BigDecimal.TEN, null, 30);
        var loja = new Loja();
        var area = new AreaEntregaLoja();
        var response = CriarAreaEntregaResponse.builder().id(UUID.randomUUID()).lojaId(lojaId).build();
        when(validarLojaExisteService.validar(lojaId)).thenReturn(loja);
        when(areaEntregaMapper.toEntity(request)).thenReturn(area);
        when(areaEntregaLojaRepository.save(area)).thenReturn(area);
        when(areaEntregaMapper.toCriarAreaEntregaResponse(area)).thenReturn(response);

        var resultado = service.criar(request);

        assertThat(resultado).isEqualTo(response);
        assertThat(area.getLoja()).isEqualTo(loja);
        verify(areaEntregaValidator).validarCriacao(request);
    }
}
