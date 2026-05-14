package br.com.meveum.lojas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.service.ObterUsuarioAutenticadoService;
import br.com.meveum.entrega.repository.AreaEntregaLojaRepository;
import br.com.meveum.lojas.dto.DetalharLojaResponse;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.entity.UsuarioLoja;
import br.com.meveum.lojas.mapper.LojaMapper;
import br.com.meveum.lojas.repository.PeriodoFuncionamentoLojaRepository;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DetalharMinhaLojaServiceTest {

    @Mock
    private ObterUsuarioAutenticadoService obterUsuarioAutenticadoService;
    @Mock
    private PeriodoFuncionamentoLojaRepository periodoFuncionamentoLojaRepository;
    @Mock
    private AreaEntregaLojaRepository areaEntregaLojaRepository;
    @Mock
    private LojaMapper lojaMapper;
    @InjectMocks
    private DetalharMinhaLojaService service;

    @Test
    void deveDetalharLojaDoUsuarioAutenticado() {
        var lojaId = UUID.randomUUID();
        var loja = new Loja();
        loja.setId(lojaId);
        var usuario = new UsuarioLoja();
        usuario.setLoja(loja);
        var response = DetalharLojaResponse.builder().id(lojaId).build();

        when(obterUsuarioAutenticadoService.getUsuarioAutenticado()).thenReturn(usuario);
        when(periodoFuncionamentoLojaRepository.findByLojaIdOrderByDayOfWeekAsc(lojaId)).thenReturn(List.of());
        when(areaEntregaLojaRepository.findByLojaIdOrderByNameAsc(lojaId)).thenReturn(List.of());
        when(lojaMapper.toDetalharLojaResponse(loja, List.of(), List.of())).thenReturn(response);

        assertThat(service.detalhar()).isEqualTo(response);
    }
}
