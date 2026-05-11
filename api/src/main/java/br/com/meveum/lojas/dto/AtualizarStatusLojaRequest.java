package br.com.meveum.lojas.dto;

import br.com.meveum.lojas.entity.enums.LojaStatus;
import jakarta.validation.constraints.NotNull;

public record AtualizarStatusLojaRequest(
    @NotNull
    LojaStatus status
) {
}
