package br.com.meveum.lojas.dto;

import jakarta.validation.constraints.NotNull;

public record AtualizarPausaManualLojaRequest(
    @NotNull
    Boolean pausadaManualmente
) {
}
