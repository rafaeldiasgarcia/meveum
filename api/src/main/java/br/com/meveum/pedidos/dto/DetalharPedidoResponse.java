package br.com.meveum.pedidos.dto;

import br.com.meveum.pagamentos.entity.enums.FormaPagamento;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import br.com.meveum.pedidos.entity.enums.TipoRecebimento;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import lombok.Builder;

@Builder
public record DetalharPedidoResponse(
    UUID id,
    UUID lojaId,
    UUID clienteId,
    String nomeCliente,
    String telefoneCliente,
    TipoRecebimento tipoRecebimento,
    StatusPedido status,
    FormaPagamento formaPagamento,
    BigDecimal subtotal,
    BigDecimal taxaEntrega,
    BigDecimal desconto,
    BigDecimal total,
    Boolean precisaTroco,
    BigDecimal trocoPara,
    String observacaoCliente,
    String enderecoEntrega,
    List<ItemPedidoResponse> itens,
    OffsetDateTime criadoEm,
    OffsetDateTime atualizadoEm
) {
}
