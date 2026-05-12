package br.com.meveum.integracao_whatsapp.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class WhatsappMapperTest {

    private final WhatsappMapper mapper = new WhatsappMapper();

    @Test
    void deveConverterPedidoParaResponseComUrlEnvio() {
        var loja = new Loja();
        loja.setId(UUID.randomUUID());
        var pedido = Pedido.builder()
            .id(UUID.randomUUID())
            .loja(loja)
            .status(StatusPedido.NEW)
            .customerPhone("(11) 99999-9999")
            .whatsappMessage("Ola mundo")
            .build();

        var response = mapper.toObterMensagemWhatsappPedidoResponse(pedido);

        assertThat(response.pedidoId()).isEqualTo(pedido.getId());
        assertThat(response.lojaId()).isEqualTo(loja.getId());
        assertThat(response.telefoneDestino()).isEqualTo("(11) 99999-9999");
        assertThat(response.mensagem()).isEqualTo("Ola mundo");
        assertThat(response.urlEnvio()).isEqualTo("https://wa.me/11999999999?text=Ola+mundo");
    }
}
