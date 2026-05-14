package br.com.meveum.dashboard.dto;

import java.util.UUID;
import lombok.Builder;

@Builder
public record KdsItemDashboardResponse(
    UUID id,
    Integer numero,
    String nomeProduto,
    Long minutosEmPreparo
) {
}
