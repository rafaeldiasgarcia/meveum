package br.com.meveum.dashboard.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.crm.repository.ClienteRepository;
import br.com.meveum.crm.repository.projection.ClienteRecorrenteProjection;
import br.com.meveum.dashboard.dto.ClienteRecorrenteDashboardResponse;
import br.com.meveum.dashboard.mapper.DashboardMapper;
import br.com.meveum.dashboard.validator.DashboardValidator;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

@ExtendWith(MockitoExtension.class)
class ListarClientesRecorrentesDashboardServiceTest {

    @Mock
    private DashboardValidator dashboardValidator;
    @Mock
    private ValidarLojaExisteService validarLojaExisteService;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;
    @Mock
    private ClienteRepository clienteRepository;
    @Mock
    private DashboardMapper dashboardMapper;
    @InjectMocks
    private ListarClientesRecorrentesDashboardService service;

    @Test
    void deveListarClientesRecorrentes() {
        var lojaId = UUID.randomUUID();
        var projection = org.mockito.Mockito.mock(ClienteRecorrenteProjection.class);
        var response = ClienteRecorrenteDashboardResponse.builder().id(UUID.randomUUID()).build();
        when(clienteRepository.listarClientesRecorrentes(lojaId, PageRequest.of(0, 5)))
            .thenReturn(List.of(projection));
        when(dashboardMapper.toClienteRecorrenteDashboardResponse(projection)).thenReturn(response);

        var resultado = service.listar(lojaId, 5);

        assertThat(resultado).containsExactly(response);
        verify(dashboardValidator).validarLimite(5);
        verify(validarLojaExisteService).validar(lojaId);
        verify(validarAcessoLojaService).validar(lojaId);
    }
}
