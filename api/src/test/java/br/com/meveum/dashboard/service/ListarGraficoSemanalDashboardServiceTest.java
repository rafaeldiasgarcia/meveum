package br.com.meveum.dashboard.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.dashboard.dto.DadoGraficoDashboardResponse;
import br.com.meveum.dashboard.mapper.DashboardMapper;
import br.com.meveum.dashboard.validator.DashboardValidator;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.pedidos.repository.PedidoRepository;
import br.com.meveum.pedidos.repository.projection.FaturamentoDiaProjection;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ListarGraficoSemanalDashboardServiceTest {

    @Mock
    private DashboardValidator dashboardValidator;
    @Mock
    private ValidarLojaExisteService validarLojaExisteService;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;
    @Mock
    private PedidoRepository pedidoRepository;
    @Mock
    private DashboardMapper dashboardMapper;
    @InjectMocks
    private ListarGraficoSemanalDashboardService service;

    @Test
    void deveListarGraficoSemanalComDiasSemPedidoZerados() {
        var lojaId = UUID.randomUUID();
        var inicio = OffsetDateTime.now().minusDays(7);
        var fim = OffsetDateTime.now();
        when(pedidoRepository.listarFaturamentoPorDiaSemana(lojaId, inicio, fim))
            .thenReturn(List.of(new FaturamentoDiaProjectionStub(1, BigDecimal.TEN)));
        when(dashboardMapper.toDadoGraficoDashboardResponse("Seg", BigDecimal.TEN))
            .thenReturn(new DadoGraficoDashboardResponse("Seg", BigDecimal.TEN));
        when(dashboardMapper.toDadoGraficoDashboardResponse("Ter", BigDecimal.ZERO))
            .thenReturn(new DadoGraficoDashboardResponse("Ter", BigDecimal.ZERO));
        when(dashboardMapper.toDadoGraficoDashboardResponse("Qua", BigDecimal.ZERO))
            .thenReturn(new DadoGraficoDashboardResponse("Qua", BigDecimal.ZERO));
        when(dashboardMapper.toDadoGraficoDashboardResponse("Qui", BigDecimal.ZERO))
            .thenReturn(new DadoGraficoDashboardResponse("Qui", BigDecimal.ZERO));
        when(dashboardMapper.toDadoGraficoDashboardResponse("Sex", BigDecimal.ZERO))
            .thenReturn(new DadoGraficoDashboardResponse("Sex", BigDecimal.ZERO));
        when(dashboardMapper.toDadoGraficoDashboardResponse("Sab", BigDecimal.ZERO))
            .thenReturn(new DadoGraficoDashboardResponse("Sab", BigDecimal.ZERO));
        when(dashboardMapper.toDadoGraficoDashboardResponse("Dom", BigDecimal.ZERO))
            .thenReturn(new DadoGraficoDashboardResponse("Dom", BigDecimal.ZERO));

        var resultado = service.listar(lojaId, inicio, fim);

        assertThat(resultado).hasSize(7);
        assertThat(resultado.get(0).valor()).isEqualTo(BigDecimal.TEN);
        assertThat(resultado.get(1).valor()).isEqualTo(BigDecimal.ZERO);
        verify(dashboardValidator).validarPeriodo(inicio, fim);
        verify(validarLojaExisteService).validar(lojaId);
        verify(validarAcessoLojaService).validar(lojaId);
    }

    private record FaturamentoDiaProjectionStub(
        Integer diaSemana,
        BigDecimal valor
    ) implements FaturamentoDiaProjection {

        @Override
        public Integer getDiaSemana() {
            return diaSemana;
        }

        @Override
        public BigDecimal getValor() {
            return valor;
        }
    }
}
