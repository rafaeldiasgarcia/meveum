package br.com.meveum.dashboard.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.meveum.pedidos.repository.projection.ProdutoMaisVendidoProjection;
import java.math.BigDecimal;
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
            1L,
            2L,
            3L,
            4L,
            5L
        );

        assertThat(response.lojaId()).isEqualTo(lojaId);
        assertThat(response.faturamentoTotal()).isEqualTo(BigDecimal.valueOf(100));
        assertThat(response.quantidadePedidos()).isEqualTo(2L);
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
}
