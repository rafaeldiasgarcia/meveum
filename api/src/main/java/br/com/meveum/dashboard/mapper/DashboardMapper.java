package br.com.meveum.dashboard.mapper;

import br.com.meveum.crm.repository.projection.ClienteRecorrenteProjection;
import br.com.meveum.dashboard.dto.ClienteRecorrenteDashboardResponse;
import br.com.meveum.dashboard.dto.DadoGraficoDashboardResponse;
import br.com.meveum.dashboard.dto.KdsItemDashboardResponse;
import br.com.meveum.dashboard.dto.ListarProdutoMaisVendidoResponse;
import br.com.meveum.dashboard.dto.ObterResumoDashboardResponse;
import br.com.meveum.dashboard.dto.PedidoResumoDashboardResponse;
import br.com.meveum.pedidos.entity.ItemPedido;
import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import br.com.meveum.pedidos.entity.enums.TipoRecebimento;
import br.com.meveum.pedidos.repository.projection.ProdutoMaisVendidoProjection;
import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class DashboardMapper {

    public ObterResumoDashboardResponse toObterResumoDashboardResponse(
        UUID lojaId,
        BigDecimal faturamentoTotal,
        Long quantidadePedidos,
        BigDecimal ticketMedio,
        Double tempoMedioCozinhaMin,
        Double variacaoPedidos,
        Double variacaoFaturamento,
        Double variacaoTicket,
        Double variacaoTempoCozinha,
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
            .tempoMedioCozinhaMin(tempoMedioCozinhaMin)
            .variacaoPedidos(variacaoPedidos)
            .variacaoFaturamento(variacaoFaturamento)
            .variacaoTicket(variacaoTicket)
            .variacaoTempoCozinha(variacaoTempoCozinha)
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

    public DadoGraficoDashboardResponse toDadoGraficoDashboardResponse(String label, BigDecimal valor) {
        return DadoGraficoDashboardResponse.builder()
            .label(label)
            .valor(valor)
            .build();
    }

    public PedidoResumoDashboardResponse toPedidoResumoDashboardResponse(
        Pedido pedido,
        List<ItemPedido> itens,
        Integer numero,
        String local,
        String tempoStr
    ) {
        return PedidoResumoDashboardResponse.builder()
            .id(pedido.getId())
            .numero(numero)
            .descricao(toDescricaoItens(itens))
            .nomeCliente(pedido.getCustomerName())
            .local(local)
            .status(toStatusWeb(pedido.getStatus()))
            .tempoStr(tempoStr)
            .total(pedido.getTotal())
            .formaPagamento(pedido.getPaymentMethod().name())
            .build();
    }

    public KdsItemDashboardResponse toKdsItemDashboardResponse(
        Pedido pedido,
        List<ItemPedido> itens,
        Integer numero,
        Long minutosEmPreparo
    ) {
        return KdsItemDashboardResponse.builder()
            .id(pedido.getId())
            .numero(numero)
            .nomeProduto(toDescricaoItens(itens))
            .minutosEmPreparo(minutosEmPreparo)
            .build();
    }

    public ClienteRecorrenteDashboardResponse toClienteRecorrenteDashboardResponse(
        ClienteRecorrenteProjection projection
    ) {
        return ClienteRecorrenteDashboardResponse.builder()
            .id(projection.getId())
            .nome(projection.getNome())
            .iniciais(toIniciais(projection.getNome()))
            .totalPedidos(projection.getTotalPedidos())
            .totalGasto(projection.getTotalGasto())
            .badge(toBadge(projection.getTotalPedidos()))
            .build();
    }

    private String toDescricaoItens(List<ItemPedido> itens) {
        if (itens == null || itens.isEmpty()) {
            return "Pedido sem itens";
        }

        return itens.stream()
            .map(ItemPedido::getProductName)
            .toList()
            .stream()
            .reduce((primeiro, proximo) -> primeiro + ", " + proximo)
            .orElse("Pedido sem itens");
    }

    private String toStatusWeb(StatusPedido status) {
        return switch (status) {
            case NEW -> "recebido";
            case PREPARING -> "em_preparo";
            case OUT_FOR_DELIVERY -> "saiu_entrega";
            case DONE -> "finalizado";
            case CANCELED -> "cancelado";
        };
    }

    private String toIniciais(String nome) {
        if (nome == null || nome.isBlank()) {
            return "";
        }

        var partes = nome.trim().split("\\s+");
        var primeira = partes[0].substring(0, 1);
        var segunda = partes.length > 1 ? partes[1].substring(0, 1) : "";
        return (primeira + segunda).toUpperCase(Locale.ROOT);
    }

    private String toBadge(Long totalPedidos) {
        return totalPedidos >= 20 ? "VIP" : "RECORRENTE";
    }
}
