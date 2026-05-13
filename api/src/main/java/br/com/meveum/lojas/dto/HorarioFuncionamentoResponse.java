package br.com.meveum.lojas.dto;

import java.time.LocalTime;
import java.util.UUID;
import lombok.Builder;

@Builder
public record HorarioFuncionamentoResponse(
    UUID id,
    Short diaSemana,
    LocalTime abertura,
    LocalTime fechamento,
    Boolean ativo
) {
}
