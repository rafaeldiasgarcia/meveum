package br.com.meveum.pagamentos.formas.dto;

import br.com.meveum.pagamentos.entity.enums.FormaPagamento;
import java.util.UUID;
import lombok.Builder;

@Builder
public record AtualizarFormaPagamentoResponse(
    UUID id,
    UUID lojaId,
    FormaPagamento formaPagamento,
    Boolean ativo
) {
}
