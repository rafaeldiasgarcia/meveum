package br.com.meveum.dashboard.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.dashboard.dto.ListarProdutoMaisVendidoResponse;
import br.com.meveum.dashboard.mapper.DashboardMapper;
import br.com.meveum.dashboard.validator.DashboardValidator;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.pedidos.repository.ItemPedidoRepository;
import br.com.meveum.pedidos.repository.projection.ProdutoMaisVendidoProjection;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ListarProdutosMaisVendidosDashboardServiceTest {

    @Mock
    private DashboardValidator dashboardValidator;
    @Mock
    private ValidarLojaExisteService validarLojaExisteService;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;
    @Mock
    private ItemPedidoRepository itemPedidoRepository;
    @Mock
    private DashboardMapper dashboardMapper;
    @Mock
    private ProdutoMaisVendidoProjection projection;
    @InjectMocks
    private ListarProdutosMaisVendidosDashboardService service;

    @Test
    void deveListarProdutosMaisVendidos() {
        var lojaId = UUID.randomUUID();
        var inicio = OffsetDateTime.now().minusDays(1);
        var fim = OffsetDateTime.now();
        var response = ListarProdutoMaisVendidoResponse.builder().produtoId(UUID.randomUUID()).build();
        when(itemPedidoRepository.listarProdutosMaisVendidos(lojaId, inicio, fim, 5)).thenReturn(List.of(projection));
        when(dashboardMapper.toListarProdutoMaisVendidoResponse(projection)).thenReturn(response);

        var resultado = service.listar(lojaId, inicio, fim, 5);

        assertThat(resultado).containsExactly(response);
        verify(dashboardValidator).validarPeriodo(inicio, fim);
        verify(dashboardValidator).validarLimite(5);
        verify(validarLojaExisteService).validar(lojaId);
        verify(validarAcessoLojaService).validar(lojaId);
    }
}
