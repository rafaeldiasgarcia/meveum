package br.com.meveum.dashboard.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.dashboard.dto.KdsItemDashboardResponse;
import br.com.meveum.dashboard.mapper.DashboardMapper;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.pagamentos.entity.enums.FormaPagamento;
import br.com.meveum.pedidos.entity.ItemPedido;
import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import br.com.meveum.pedidos.entity.enums.TipoRecebimento;
import br.com.meveum.pedidos.repository.ItemPedidoRepository;
import br.com.meveum.pedidos.repository.PedidoRepository;
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
class ListarKdsDashboardServiceTest {

    @Mock
    private ValidarLojaExisteService validarLojaExisteService;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;
    @Mock
    private PedidoRepository pedidoRepository;
    @Mock
    private ItemPedidoRepository itemPedidoRepository;
    @Mock
    private DashboardMapper dashboardMapper;
    @InjectMocks
    private ListarKdsDashboardService service;

    @Test
    void deveListarItensEmPreparo() {
        var lojaId = UUID.randomUUID();
        var pedido = pedido();
        var item = itemPedido(pedido);
        var response = KdsItemDashboardResponse.builder().id(pedido.getId()).numero(1).build();

        when(pedidoRepository.findByLojaIdAndStatusOrderByUpdatedAtAsc(lojaId, StatusPedido.PREPARING))
            .thenReturn(List.of(pedido));
        when(itemPedidoRepository.findByPedidoIdIn(List.of(pedido.getId()))).thenReturn(List.of(item));
        when(dashboardMapper.toKdsItemDashboardResponse(
            org.mockito.ArgumentMatchers.eq(pedido),
            org.mockito.ArgumentMatchers.eq(List.of(item)),
            org.mockito.ArgumentMatchers.eq(1),
            org.mockito.ArgumentMatchers.anyLong()
        )).thenReturn(response);

        var resultado = service.listar(lojaId);

        assertThat(resultado).containsExactly(response);
        verify(validarLojaExisteService).validar(lojaId);
        verify(validarAcessoLojaService).validar(lojaId);
    }

    private Pedido pedido() {
        return Pedido.builder()
            .id(UUID.randomUUID())
            .customerName("Cliente")
            .customerPhone("5511999999999")
            .fulfillmentType(TipoRecebimento.PICKUP)
            .status(StatusPedido.PREPARING)
            .paymentMethod(FormaPagamento.PIX)
            .subtotal(BigDecimal.TEN)
            .total(BigDecimal.TEN)
            .updatedAt(OffsetDateTime.now().minusMinutes(10))
            .build();
    }

    private ItemPedido itemPedido(Pedido pedido) {
        return ItemPedido.builder()
            .id(UUID.randomUUID())
            .pedido(pedido)
            .productName("Smash")
            .unitPrice(BigDecimal.TEN)
            .quantity(1)
            .total(BigDecimal.TEN)
            .build();
    }
}
