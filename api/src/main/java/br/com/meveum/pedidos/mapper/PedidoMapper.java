package br.com.meveum.pedidos.mapper;

import br.com.meveum.cardapio.entity.OpcaoComplemento;
import br.com.meveum.cardapio.entity.Produto;
import br.com.meveum.pedidos.dto.AtualizarStatusPedidoResponse;
import br.com.meveum.pedidos.dto.ComplementoPedidoResponse;
import br.com.meveum.pedidos.dto.CriarItemPedidoRequest;
import br.com.meveum.pedidos.dto.CriarPedidoRequest;
import br.com.meveum.pedidos.dto.CriarPedidoResponse;
import br.com.meveum.pedidos.dto.DetalharPedidoResponse;
import br.com.meveum.pedidos.dto.ItemPedidoResponse;
import br.com.meveum.pedidos.dto.ListarPedidoResponse;
import br.com.meveum.pedidos.entity.ComplementoItemPedido;
import br.com.meveum.pedidos.entity.ItemPedido;
import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class PedidoMapper {

    public Pedido toEntity(CriarPedidoRequest request, BigDecimal subtotal, BigDecimal taxaEntrega, BigDecimal total, String enderecoEntrega) {
        return Pedido.builder()
            .customerName(request.nomeCliente())
            .customerPhone(request.telefoneCliente())
            .fulfillmentType(request.tipoRecebimento())
            .status(StatusPedido.NEW)
            .paymentMethod(request.formaPagamento())
            .subtotal(subtotal)
            .deliveryFee(taxaEntrega)
            .discountTotal(BigDecimal.ZERO)
            .total(total)
            .needsChange(Boolean.TRUE.equals(request.precisaTroco()))
            .changeFor(request.trocoPara())
            .customerNote(request.observacaoCliente())
            .deliveryAddressSnapshot(enderecoEntrega)
            .build();
    }

    public ItemPedido toEntity(CriarItemPedidoRequest request, Produto produto, BigDecimal total) {
        return ItemPedido.builder()
            .produto(produto)
            .productName(produto.getName())
            .unitPrice(produto.getBasePrice())
            .quantity(request.quantidade())
            .total(total)
            .note(request.observacao())
            .build();
    }

    public ComplementoItemPedido toEntity(OpcaoComplemento opcao, Integer quantidade, BigDecimal total) {
        return ComplementoItemPedido.builder()
            .grupoComplemento(opcao.getGrupoComplemento())
            .complementGroupName(opcao.getGrupoComplemento().getName())
            .opcaoComplemento(opcao)
            .complementOptionName(opcao.getName())
            .unitPrice(opcao.getAdditionalPrice())
            .quantity(quantidade)
            .total(total)
            .build();
    }

    public CriarPedidoResponse toCriarPedidoResponse(Pedido pedido, List<ItemPedidoResponse> itens) {
        return CriarPedidoResponse.builder()
            .id(pedido.getId())
            .lojaId(pedido.getLoja().getId())
            .clienteId(pedido.getCliente() == null ? null : pedido.getCliente().getId())
            .nomeCliente(pedido.getCustomerName())
            .telefoneCliente(pedido.getCustomerPhone())
            .tipoRecebimento(pedido.getFulfillmentType())
            .status(pedido.getStatus())
            .formaPagamento(pedido.getPaymentMethod())
            .subtotal(pedido.getSubtotal())
            .taxaEntrega(pedido.getDeliveryFee())
            .desconto(pedido.getDiscountTotal())
            .total(pedido.getTotal())
            .precisaTroco(pedido.getNeedsChange())
            .trocoPara(pedido.getChangeFor())
            .observacaoCliente(pedido.getCustomerNote())
            .enderecoEntrega(pedido.getDeliveryAddressSnapshot())
            .itens(itens)
            .criadoEm(pedido.getCreatedAt())
            .atualizadoEm(pedido.getUpdatedAt())
            .build();
    }

    public ListarPedidoResponse toListarPedidoResponse(Pedido pedido) {
        return ListarPedidoResponse.builder()
            .id(pedido.getId())
            .lojaId(pedido.getLoja().getId())
            .nomeCliente(pedido.getCustomerName())
            .telefoneCliente(pedido.getCustomerPhone())
            .tipoRecebimento(pedido.getFulfillmentType())
            .status(pedido.getStatus())
            .formaPagamento(pedido.getPaymentMethod())
            .total(pedido.getTotal())
            .criadoEm(pedido.getCreatedAt())
            .build();
    }

    public DetalharPedidoResponse toDetalharPedidoResponse(Pedido pedido, List<ItemPedidoResponse> itens) {
        return DetalharPedidoResponse.builder()
            .id(pedido.getId())
            .lojaId(pedido.getLoja().getId())
            .clienteId(pedido.getCliente() == null ? null : pedido.getCliente().getId())
            .nomeCliente(pedido.getCustomerName())
            .telefoneCliente(pedido.getCustomerPhone())
            .tipoRecebimento(pedido.getFulfillmentType())
            .status(pedido.getStatus())
            .formaPagamento(pedido.getPaymentMethod())
            .subtotal(pedido.getSubtotal())
            .taxaEntrega(pedido.getDeliveryFee())
            .desconto(pedido.getDiscountTotal())
            .total(pedido.getTotal())
            .precisaTroco(pedido.getNeedsChange())
            .trocoPara(pedido.getChangeFor())
            .observacaoCliente(pedido.getCustomerNote())
            .enderecoEntrega(pedido.getDeliveryAddressSnapshot())
            .itens(itens)
            .criadoEm(pedido.getCreatedAt())
            .atualizadoEm(pedido.getUpdatedAt())
            .build();
    }

    public AtualizarStatusPedidoResponse toAtualizarStatusPedidoResponse(Pedido pedido) {
        return AtualizarStatusPedidoResponse.builder()
            .id(pedido.getId())
            .lojaId(pedido.getLoja().getId())
            .status(pedido.getStatus())
            .atualizadoEm(pedido.getUpdatedAt())
            .build();
    }

    public ItemPedidoResponse toItemPedidoResponse(ItemPedido item, List<ComplementoPedidoResponse> complementos) {
        return ItemPedidoResponse.builder()
            .id(item.getId())
            .produtoId(item.getProduto() == null ? null : item.getProduto().getId())
            .nomeProduto(item.getProductName())
            .precoUnitario(item.getUnitPrice())
            .quantidade(item.getQuantity())
            .total(item.getTotal())
            .observacao(item.getNote())
            .complementos(complementos)
            .build();
    }

    public ComplementoPedidoResponse toComplementoPedidoResponse(ComplementoItemPedido complemento) {
        return ComplementoPedidoResponse.builder()
            .id(complemento.getId())
            .grupoComplementoId(complemento.getGrupoComplemento() == null ? null : complemento.getGrupoComplemento().getId())
            .nomeGrupoComplemento(complemento.getComplementGroupName())
            .opcaoComplementoId(complemento.getOpcaoComplemento() == null ? null : complemento.getOpcaoComplemento().getId())
            .nomeOpcaoComplemento(complemento.getComplementOptionName())
            .precoUnitario(complemento.getUnitPrice())
            .quantidade(complemento.getQuantity())
            .total(complemento.getTotal())
            .build();
    }

    public List<ItemPedidoResponse> toItemPedidoResponseList(
        List<ItemPedido> itens,
        Map<ItemPedido, List<ComplementoItemPedido>> complementosPorItem
    ) {
        return itens.stream()
            .map(item -> toItemPedidoResponse(
                item,
                complementosPorItem.getOrDefault(item, List.of()).stream()
                    .map(this::toComplementoPedidoResponse)
                    .toList()
            ))
            .toList();
    }
}
