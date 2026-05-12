package br.com.meveum.pagamentos.formas.dto;

import br.com.meveum.pagamentos.entity.enums.FormaPagamento;
import jakarta.validation.constraints.NotNull;

public record AtualizarFormaPagamentoRequest(
    @NotNull
    FormaPagamento formaPagamento,

    @NotNull
    Boolean ativo
) {
}
