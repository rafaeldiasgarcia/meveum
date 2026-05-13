package br.com.meveum.lojas.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;

public record AtualizarHorarioFuncionamentoRequest(
    @NotNull
    Short diaSemana,

    @NotNull
    LocalTime abertura,

    @NotNull
    LocalTime fechamento,

    @NotNull
    Boolean ativo
) {
}
