package br.com.meveum.dashboard.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.dashboard.dto.PedidoResumoDashboardResponse;
import br.com.meveum.dashboard.mapper.DashboardMapper;
import br.com.meveum.dashboard.validator.DashboardValidator;
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
import org.springframework.data.domain.PageRequest;
import tools.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
class ListarPedidosResumoDashboardServiceTest {

    @Mock
    private DashboardValidator dashboardValidator;
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
    @Mock
    private ObjectMapper objectMapper;
    @InjectMocks
    private ListarPedidosResumoDashboardService service;

    @Test
    void deveListarPedidosResumoAtivos() {
        var lojaId = UUID.randomUUID();
        var pedido = pedido(StatusPedido.NEW);
        var item = itemPedido(pedido);
        var response = PedidoResumoDashboardResponse.builder().id(pedido.getId()).numero(1).build();

        when(pedidoRepository.findByLojaIdAndStatusNotInOrderByCreatedAtDesc(
            lojaId,
            List.of(StatusPedido.CANCELED, StatusPedido.DONE),
            PageRequest.of(0, 10)
        )).thenReturn(List.of(pedido));
        when(itemPedidoRepository.findByPedidoIdIn(List.of(pedido.getId()))).thenReturn(List.of(item));
        when(dashboardMapper.toPedidoResumoDashboardResponse(
            org.mockito.ArgumentMatchers.eq(pedido),
            org.mockito.ArgumentMatchers.eq(List.of(item)),
            org.mockito.ArgumentMatchers.eq(1),
            org.mockito.ArgumentMatchers.eq("Retirada"),
            org.mockito.ArgumentMatchers.anyString()
        )).thenReturn(response);

        var resultado = service.listar(lojaId, 10);

        assertThat(resultado).containsExactly(response);
        verify(dashboardValidator).validarLimite(10);
        verify(validarLojaExisteService).validar(lojaId);
        verify(validarAcessoLojaService).validar(lojaId);
    }

    private Pedido pedido(StatusPedido status) {
        return Pedido.builder()
            .id(UUID.randomUUID())
            .customerName("Cliente")
            .customerPhone("5511999999999")
            .fulfillmentType(TipoRecebimento.PICKUP)
            .status(status)
            .paymentMethod(FormaPagamento.PIX)
            .subtotal(BigDecimal.TEN)
            .total(BigDecimal.TEN)
            .createdAt(OffsetDateTime.now().minusMinutes(5))
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
