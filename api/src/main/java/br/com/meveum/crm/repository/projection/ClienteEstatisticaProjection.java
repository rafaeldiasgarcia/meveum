package br.com.meveum.crm.repository.projection;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public interface ClienteEstatisticaProjection {

    UUID getId();

    UUID getLojaId();

    String getNome();

    String getTelefone();

    Long getTotalPedidos();

    BigDecimal getTotalGasto();

    Instant getUltimoPedido();

    Instant getCriadoEm();
}
