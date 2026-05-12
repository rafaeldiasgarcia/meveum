package br.com.meveum.dashboard.mapper;

import br.com.meveum.dashboard.dto.ListarProdutoMaisVendidoResponse;
import br.com.meveum.dashboard.dto.ObterResumoDashboardResponse;
import br.com.meveum.pedidos.repository.projection.ProdutoMaisVendidoProjection;
import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class DashboardMapper {

    public ObterResumoDashboardResponse toObterResumoDashboardResponse(
        UUID lojaId,
        BigDecimal faturamentoTotal,
        Long quantidadePedidos,
        BigDecimal ticketMedio,
        Long pedidosNovos,
        Long pedidosEmPreparo,
        Long pedidosEmEntrega,
        Long pedidosFinalizados,
        Long pedidosCancelados
    ) {
        return ObterResumoDashboardResponse.builder()
            .lojaId(lojaId)
            .faturamentoTotal(faturamentoTotal)
            .quantidadePedidos(quantidadePedidos)
            .ticketMedio(ticketMedio)
            .pedidosNovos(pedidosNovos)
            .pedidosEmPreparo(pedidosEmPreparo)
            .pedidosEmEntrega(pedidosEmEntrega)
            .pedidosFinalizados(pedidosFinalizados)
            .pedidosCancelados(pedidosCancelados)
            .build();
    }

    public ListarProdutoMaisVendidoResponse toListarProdutoMaisVendidoResponse(ProdutoMaisVendidoProjection projection) {
        return ListarProdutoMaisVendidoResponse.builder()
            .produtoId(UUID.fromString(projection.getProdutoId()))
            .nomeProduto(projection.getNomeProduto())
            .quantidadeVendida(projection.getQuantidadeVendida())
            .faturamento(projection.getFaturamento())
            .build();
    }
}
