package br.com.meveum.dashboard.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;

@Builder
public record ClienteRecorrenteDashboardResponse(
    UUID id,
    String nome,
    String iniciais,
    Long totalPedidos,
    BigDecimal totalGasto,
    String badge
) {
}
