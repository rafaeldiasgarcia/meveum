package br.com.meveum.entrega.areas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.entrega.areas.validator.service.ValidarAreaEntregaExisteService;
import br.com.meveum.entrega.entity.AreaEntregaLoja;
import br.com.meveum.entrega.repository.AreaEntregaLojaRepository;
import br.com.meveum.lojas.entity.Loja;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExcluirAreaEntregaServiceTest {

    @Mock
    private ValidarAreaEntregaExisteService validarAreaEntregaExisteService;
    @Mock
    private AreaEntregaLojaRepository areaEntregaLojaRepository;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;

    @InjectMocks
    private ExcluirAreaEntregaService service;

    @Test
    void deveInativarAreaEntrega() {
        var areaId = UUID.randomUUID();
        var loja = new Loja();
        loja.setId(UUID.randomUUID());
        var area = new AreaEntregaLoja();
        area.setLoja(loja);
        area.setActive(true);
        when(validarAreaEntregaExisteService.validar(areaId)).thenReturn(area);

        service.excluir(areaId);

        assertThat(area.getActive()).isFalse();
        verify(areaEntregaLojaRepository).save(area);
    }
}
