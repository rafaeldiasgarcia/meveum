package br.com.meveum.pagamentos.formas.dto;

import br.com.meveum.pagamentos.entity.enums.FormaPagamento;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CriarFormaPagamentoRequest(
    @NotNull
    UUID lojaId,

    @NotNull
    FormaPagamento formaPagamento
) {
}
