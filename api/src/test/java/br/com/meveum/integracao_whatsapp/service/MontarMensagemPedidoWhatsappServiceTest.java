package br.com.meveum.integracao_whatsapp.service;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.pedidos.entity.ItemPedido;
import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;

class MontarMensagemPedidoWhatsappServiceTest {

    private final MontarMensagemPedidoWhatsappService service = new MontarMensagemPedidoWhatsappService();

    @Test
    void deveMontarMensagemDePedidoCriado() {
        var pedido = pedido(StatusPedido.NEW);
        var item = ItemPedido.builder()
            .productName("Burger")
            .quantity(2)
            .total(BigDecimal.valueOf(25))
            .build();

        var mensagem = service.montarPedidoCriado(pedido, List.of(item));

        assertThat(mensagem).contains("Ola, Rafael!");
        assertThat(mensagem).contains("Recebemos seu pedido no Loja Teste.");
        assertThat(mensagem).contains("2x Burger");
        assertThat(mensagem).contains("Status: novo.");
    }

    @Test
    void deveMontarMensagemDeStatusAtualizado() {
        var mensagem = service.montarStatusAtualizado(pedido(StatusPedido.OUT_FOR_DELIVERY));

        assertThat(mensagem).contains("Rafael");
        assertThat(mensagem).contains("saiu para entrega");
    }

    private Pedido pedido(StatusPedido status) {
        var loja = new Loja();
        loja.setName("Loja Teste");
        return Pedido.builder()
            .loja(loja)
            .customerName("Rafael")
            .status(status)
            .total(BigDecimal.valueOf(25))
            .build();
    }
}
