package br.com.meveum.pedidos.dto;

import br.com.meveum.pagamentos.entity.enums.FormaPagamento;
import br.com.meveum.pedidos.entity.enums.TipoRecebimento;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CriarPedidoRequest(
    @NotNull UUID lojaId,
    UUID clienteId,
    UUID enderecoClienteId,
    @NotBlank @Size(max = 120) String nomeCliente,
    @NotBlank @Size(max = 20) String telefoneCliente,
    @NotNull TipoRecebimento tipoRecebimento,
    @NotNull FormaPagamento formaPagamento,
    Boolean precisaTroco,
    BigDecimal trocoPara,
    @Size(max = 500) String observacaoCliente,
    @NotEmpty @Valid List<CriarItemPedidoRequest> itens
) {
}
