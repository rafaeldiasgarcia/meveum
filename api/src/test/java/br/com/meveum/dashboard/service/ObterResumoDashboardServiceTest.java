package br.com.meveum.dashboard.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.dashboard.dto.ObterResumoDashboardResponse;
import br.com.meveum.dashboard.mapper.DashboardMapper;
import br.com.meveum.dashboard.validator.DashboardValidator;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import br.com.meveum.pedidos.repository.PedidoRepository;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ObterResumoDashboardServiceTest {

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
    private ObterResumoDashboardService service;

    @Test
    void deveObterResumoDashboard() {
        var lojaId = UUID.randomUUID();
        var inicio = OffsetDateTime.now().minusDays(1);
        var fim = OffsetDateTime.now();
        var response = ObterResumoDashboardResponse.builder().lojaId(lojaId).build();
        when(pedidoRepository.somarFaturamentoPorLojaEPeriodo(lojaId, inicio, fim)).thenReturn(BigDecimal.valueOf(100));
        when(pedidoRepository.contarPedidosValidosPorLojaEPeriodo(lojaId, inicio, fim)).thenReturn(2L);
        when(pedidoRepository.countByLojaIdAndStatusAndCreatedAtBetween(lojaId, StatusPedido.NEW, inicio, fim)).thenReturn(1L);
        when(pedidoRepository.countByLojaIdAndStatusAndCreatedAtBetween(lojaId, StatusPedido.PREPARING, inicio, fim)).thenReturn(2L);
        when(pedidoRepository.countByLojaIdAndStatusAndCreatedAtBetween(lojaId, StatusPedido.OUT_FOR_DELIVERY, inicio, fim)).thenReturn(3L);
        when(pedidoRepository.countByLojaIdAndStatusAndCreatedAtBetween(lojaId, StatusPedido.DONE, inicio, fim)).thenReturn(4L);
        when(pedidoRepository.countByLojaIdAndStatusAndCreatedAtBetween(lojaId, StatusPedido.CANCELED, inicio, fim)).thenReturn(5L);
        when(dashboardMapper.toObterResumoDashboardResponse(
            lojaId,
            BigDecimal.valueOf(100),
            2L,
            BigDecimal.valueOf(50).setScale(2),
            1L,
            2L,
            3L,
            4L,
            5L
        )).thenReturn(response);

        var resultado = service.obter(lojaId, inicio, fim);

        assertThat(resultado).isEqualTo(response);
        verify(dashboardValidator).validarPeriodo(inicio, fim);
        verify(validarLojaExisteService).validar(lojaId);
        verify(validarAcessoLojaService).validar(lojaId);
    }

    @Test
    void deveRetornarTicketMedioZeroQuandoNaoHouverPedidoValido() {
        var lojaId = UUID.randomUUID();
        var inicio = OffsetDateTime.now().minusDays(1);
        var fim = OffsetDateTime.now();
        var response = ObterResumoDashboardResponse.builder().lojaId(lojaId).ticketMedio(BigDecimal.ZERO).build();
        when(pedidoRepository.somarFaturamentoPorLojaEPeriodo(lojaId, inicio, fim)).thenReturn(BigDecimal.ZERO);
        when(pedidoRepository.contarPedidosValidosPorLojaEPeriodo(lojaId, inicio, fim)).thenReturn(0L);
        when(dashboardMapper.toObterResumoDashboardResponse(
            lojaId,
            BigDecimal.ZERO,
            0L,
            BigDecimal.ZERO,
            0L,
            0L,
            0L,
            0L,
            0L
        )).thenReturn(response);

        assertThat(service.obter(lojaId, inicio, fim)).isEqualTo(response);
    }
}
