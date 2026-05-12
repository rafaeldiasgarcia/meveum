package br.com.meveum.entrega.areas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.entrega.areas.dto.ListarAreaEntregaResponse;
import br.com.meveum.entrega.areas.mapper.AreaEntregaMapper;
import br.com.meveum.entrega.entity.AreaEntregaLoja;
import br.com.meveum.entrega.repository.AreaEntregaLojaRepository;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ListarAreaEntregaServiceTest {

    @Mock
    private ValidarLojaExisteService validarLojaExisteService;
    @Mock
    private AreaEntregaLojaRepository areaEntregaLojaRepository;
    @Mock
    private AreaEntregaMapper areaEntregaMapper;
    @InjectMocks
    private ListarAreaEntregaService service;

    @Test
    void deveListarAreasDaLoja() {
        var lojaId = UUID.randomUUID();
        var area = new AreaEntregaLoja();
        var response = ListarAreaEntregaResponse.builder().id(UUID.randomUUID()).lojaId(lojaId).build();
        when(areaEntregaLojaRepository.findByLojaIdOrderByNameAsc(lojaId)).thenReturn(List.of(area));
        when(areaEntregaMapper.toListarAreaEntregaResponse(area)).thenReturn(response);

        var resultado = service.listar(lojaId);

        assertThat(resultado).containsExactly(response);
        verify(validarLojaExisteService).validar(lojaId);
    }
}
