package br.com.meveum.integracao_whatsapp.service;

import br.com.meveum.pedidos.entity.ItemPedido;
import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class MontarMensagemPedidoWhatsappService {

    private static final Locale LOCALE_BR = Locale.forLanguageTag("pt-BR");

    public String montarPedidoCriado(Pedido pedido, List<ItemPedido> itens) {
        var mensagem = new StringBuilder();
        mensagem.append("Ola, ").append(pedido.getCustomerName()).append("!\n");
        mensagem.append("Recebemos seu pedido no ").append(pedido.getLoja().getName()).append(".\n\n");
        mensagem.append("Itens:\n");

        itens.forEach(item -> mensagem
            .append("- ")
            .append(item.getQuantity())
            .append("x ")
            .append(item.getProductName())
            .append(" - ")
            .append(formatarMoeda(item.getTotal()))
            .append("\n")
        );

        mensagem.append("\nTotal: ").append(formatarMoeda(pedido.getTotal())).append("\n");
        mensagem.append("Status: ").append(toDescricaoStatus(pedido.getStatus())).append(".");
        return mensagem.toString();
    }

    public String montarStatusAtualizado(Pedido pedido) {
        return "Ola, " + pedido.getCustomerName() + "!\n"
            + "Seu pedido no " + pedido.getLoja().getName()
            + " agora esta com status: " + toDescricaoStatus(pedido.getStatus()) + ".";
    }

    private String formatarMoeda(BigDecimal valor) {
        return NumberFormat.getCurrencyInstance(LOCALE_BR).format(valor);
    }

    private String toDescricaoStatus(StatusPedido status) {
        return switch (status) {
            case NEW -> "novo";
            case PREPARING -> "em preparo";
            case OUT_FOR_DELIVERY -> "saiu para entrega";
            case DONE -> "finalizado";
            case CANCELED -> "cancelado";
        };
    }
}
