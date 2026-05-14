package br.com.meveum.dashboard.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.meveum.crm.repository.projection.ClienteRecorrenteProjection;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.pagamentos.entity.enums.FormaPagamento;
import br.com.meveum.pedidos.entity.ItemPedido;
import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import br.com.meveum.pedidos.entity.enums.TipoRecebimento;
import br.com.meveum.pedidos.repository.projection.ProdutoMaisVendidoProjection;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class DashboardMapperTest {

    private final DashboardMapper dashboardMapper = new DashboardMapper();

    @Test
    void deveConverterResumoDashboardResponse() {
        var lojaId = UUID.randomUUID();

        var response = dashboardMapper.toObterResumoDashboardResponse(
            lojaId,
            BigDecimal.valueOf(100),
            2L,
            BigDecimal.valueOf(50),
            8D,
            10D,
            20D,
            5D,
            -2D,
            1L,
            2L,
            3L,
            4L,
            5L
        );

        assertThat(response.lojaId()).isEqualTo(lojaId);
        assertThat(response.faturamentoTotal()).isEqualTo(BigDecimal.valueOf(100));
        assertThat(response.quantidadePedidos()).isEqualTo(2L);
        assertThat(response.tempoMedioCozinhaMin()).isEqualTo(8D);
        assertThat(response.variacaoFaturamento()).isEqualTo(20D);
        assertThat(response.pedidosCancelados()).isEqualTo(5L);
    }

    @Test
    void deveConverterProdutoMaisVendidoResponse() {
        var produtoId = UUID.randomUUID();
        var projection = new ProdutoMaisVendidoProjectionStub(produtoId.toString(), "Burger", 3L, BigDecimal.valueOf(90));

        var response = dashboardMapper.toListarProdutoMaisVendidoResponse(projection);

        assertThat(response.produtoId()).isEqualTo(produtoId);
        assertThat(response.nomeProduto()).isEqualTo("Burger");
        assertThat(response.quantidadeVendida()).isEqualTo(3L);
        assertThat(response.faturamento()).isEqualTo(BigDecimal.valueOf(90));
    }

    @Test
    void deveConverterDadoGraficoResponse() {
        var response = dashboardMapper.toDadoGraficoDashboardResponse("Seg", BigDecimal.TEN);

        assertThat(response.label()).isEqualTo("Seg");
        assertThat(response.valor()).isEqualTo(BigDecimal.TEN);
    }

    @Test
    void deveConverterPedidoResumoResponse() {
        var pedido = pedido(StatusPedido.PREPARING);
        var itens = List.of(itemPedido(pedido, "Smash"), itemPedido(pedido, "Fritas"));

        var response = dashboardMapper.toPedidoResumoDashboardResponse(pedido, itens, 1, "Retirada", "ha 5 min");

        assertThat(response.id()).isEqualTo(pedido.getId());
        assertThat(response.numero()).isEqualTo(1);
        assertThat(response.descricao()).isEqualTo("Smash, Fritas");
        assertThat(response.status()).isEqualTo("em_preparo");
        assertThat(response.formaPagamento()).isEqualTo("PIX");
    }

    @Test
    void deveConverterKdsItemResponse() {
        var pedido = pedido(StatusPedido.PREPARING);
        var itens = List.of(itemPedido(pedido, "Smash"));

        var response = dashboardMapper.toKdsItemDashboardResponse(pedido, itens, 2, 9L);

        assertThat(response.numero()).isEqualTo(2);
        assertThat(response.nomeProduto()).isEqualTo("Smash");
        assertThat(response.minutosEmPreparo()).isEqualTo(9L);
    }

    @Test
    void deveConverterClienteRecorrenteResponse() {
        var projection = new ClienteRecorrenteProjectionStub(
            UUID.randomUUID(),
            "Carlos Mendes",
            20L,
            BigDecimal.valueOf(1200)
        );

        var response = dashboardMapper.toClienteRecorrenteDashboardResponse(projection);

        assertThat(response.nome()).isEqualTo("Carlos Mendes");
        assertThat(response.iniciais()).isEqualTo("CM");
        assertThat(response.badge()).isEqualTo("VIP");
    }

    private Pedido pedido(StatusPedido status) {
        return Pedido.builder()
            .id(UUID.randomUUID())
            .loja(new Loja())
            .customerName("Carlos")
            .customerPhone("5511999999999")
            .fulfillmentType(TipoRecebimento.PICKUP)
            .status(status)
            .paymentMethod(FormaPagamento.PIX)
            .subtotal(BigDecimal.TEN)
            .total(BigDecimal.TEN)
            .build();
    }

    private ItemPedido itemPedido(Pedido pedido, String nome) {
        return ItemPedido.builder()
            .id(UUID.randomUUID())
            .pedido(pedido)
            .productName(nome)
            .unitPrice(BigDecimal.TEN)
            .quantity(1)
            .total(BigDecimal.TEN)
            .build();
    }

    private record ProdutoMaisVendidoProjectionStub(
        String produtoId,
        String nomeProduto,
        Long quantidadeVendida,
        BigDecimal faturamento
    ) implements ProdutoMaisVendidoProjection {

        @Override
        public String getProdutoId() {
            return produtoId;
        }

        @Override
        public String getNomeProduto() {
            return nomeProduto;
        }

        @Override
        public Long getQuantidadeVendida() {
            return quantidadeVendida;
        }

        @Override
        public BigDecimal getFaturamento() {
            return faturamento;
        }
    }

    private record ClienteRecorrenteProjectionStub(
        UUID id,
        String nome,
        Long totalPedidos,
        BigDecimal totalGasto
    ) implements ClienteRecorrenteProjection {

        @Override
        public UUID getId() {
            return id;
        }

        @Override
        public String getNome() {
            return nome;
        }

        @Override
        public Long getTotalPedidos() {
            return totalPedidos;
        }

        @Override
        public BigDecimal getTotalGasto() {
            return totalGasto;
        }
    }
}
