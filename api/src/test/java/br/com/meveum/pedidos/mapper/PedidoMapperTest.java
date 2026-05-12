package br.com.meveum.pedidos.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.meveum.cardapio.entity.GrupoComplemento;
import br.com.meveum.cardapio.entity.OpcaoComplemento;
import br.com.meveum.cardapio.entity.Produto;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.pagamentos.entity.enums.FormaPagamento;
import br.com.meveum.pedidos.dto.CriarItemPedidoRequest;
import br.com.meveum.pedidos.dto.CriarPedidoRequest;
import br.com.meveum.pedidos.entity.ComplementoItemPedido;
import br.com.meveum.pedidos.entity.ItemPedido;
import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import br.com.meveum.pedidos.entity.enums.TipoRecebimento;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class PedidoMapperTest {

    private final PedidoMapper pedidoMapper = new PedidoMapper();

    @Test
    void deveConverterCriarRequestParaPedido() {
        var request = new CriarPedidoRequest(UUID.randomUUID(), null, null, "Rafael", "11999999999", TipoRecebimento.PICKUP, FormaPagamento.PIX, false, null, "Sem cebola", List.of(itemRequest()));

        var pedido = pedidoMapper.toEntity(request, BigDecimal.TEN, BigDecimal.ZERO, BigDecimal.TEN, null);

        assertThat(pedido.getCustomerName()).isEqualTo("Rafael");
        assertThat(pedido.getStatus()).isEqualTo(StatusPedido.NEW);
        assertThat(pedido.getTotal()).isEqualTo(BigDecimal.TEN);
    }

    @Test
    void deveConverterItemEComplementoParaEntity() {
        var produto = produto();
        var opcao = opcaoComplemento();

        var item = pedidoMapper.toEntity(itemRequest(), produto, BigDecimal.valueOf(20));
        var complemento = pedidoMapper.toEntity(opcao, 2, BigDecimal.valueOf(6));

        assertThat(item.getProductName()).isEqualTo(produto.getName());
        assertThat(item.getUnitPrice()).isEqualTo(produto.getBasePrice());
        assertThat(complemento.getComplementOptionName()).isEqualTo(opcao.getName());
        assertThat(complemento.getTotal()).isEqualTo(BigDecimal.valueOf(6));
    }

    @Test
    void deveConverterPedidoParaResponses() {
        var pedido = pedido();
        var item = itemPedido();
        var complemento = complementoItemPedido();
        var itens = pedidoMapper.toItemPedidoResponseList(List.of(item), Map.of(item, List.of(complemento)));

        assertThat(pedidoMapper.toCriarPedidoResponse(pedido, itens).id()).isEqualTo(pedido.getId());
        assertThat(pedidoMapper.toListarPedidoResponse(pedido).total()).isEqualTo(pedido.getTotal());
        assertThat(pedidoMapper.toDetalharPedidoResponse(pedido, itens).itens()).hasSize(1);
        assertThat(pedidoMapper.toAtualizarStatusPedidoResponse(pedido).status()).isEqualTo(pedido.getStatus());
    }

    private CriarItemPedidoRequest itemRequest() {
        return new CriarItemPedidoRequest(UUID.randomUUID(), 2, "Ponto da carne", List.of());
    }

    private Loja loja() {
        var loja = new Loja();
        loja.setId(UUID.randomUUID());
        return loja;
    }

    private Produto produto() {
        return Produto.builder()
            .id(UUID.randomUUID())
            .loja(loja())
            .name("Burger")
            .basePrice(BigDecimal.TEN)
            .active(true)
            .build();
    }

    private OpcaoComplemento opcaoComplemento() {
        var grupo = GrupoComplemento.builder()
            .id(UUID.randomUUID())
            .name("Molhos")
            .active(true)
            .build();
        return OpcaoComplemento.builder()
            .id(UUID.randomUUID())
            .grupoComplemento(grupo)
            .name("Maionese")
            .additionalPrice(BigDecimal.valueOf(3))
            .active(true)
            .build();
    }

    private Pedido pedido() {
        return Pedido.builder()
            .id(UUID.randomUUID())
            .loja(loja())
            .customerName("Rafael")
            .customerPhone("11999999999")
            .fulfillmentType(TipoRecebimento.PICKUP)
            .status(StatusPedido.NEW)
            .paymentMethod(FormaPagamento.PIX)
            .subtotal(BigDecimal.TEN)
            .deliveryFee(BigDecimal.ZERO)
            .discountTotal(BigDecimal.ZERO)
            .total(BigDecimal.TEN)
            .needsChange(false)
            .build();
    }

    private ItemPedido itemPedido() {
        return ItemPedido.builder()
            .id(UUID.randomUUID())
            .produto(produto())
            .productName("Burger")
            .unitPrice(BigDecimal.TEN)
            .quantity(1)
            .total(BigDecimal.TEN)
            .build();
    }

    private ComplementoItemPedido complementoItemPedido() {
        return ComplementoItemPedido.builder()
            .id(UUID.randomUUID())
            .opcaoComplemento(opcaoComplemento())
            .grupoComplemento(opcaoComplemento().getGrupoComplemento())
            .complementGroupName("Molhos")
            .complementOptionName("Maionese")
            .unitPrice(BigDecimal.ONE)
            .quantity(1)
            .total(BigDecimal.ONE)
            .build();
    }
}
