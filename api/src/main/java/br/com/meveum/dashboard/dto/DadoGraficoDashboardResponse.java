package br.com.meveum.dashboard.dto;

import java.math.BigDecimal;
import lombok.Builder;

@Builder
public record DadoGraficoDashboardResponse(
    String label,
    BigDecimal valor
) {
}
