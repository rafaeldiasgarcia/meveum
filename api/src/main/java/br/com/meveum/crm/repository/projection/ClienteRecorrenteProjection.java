package br.com.meveum.crm.repository.projection;

import java.math.BigDecimal;
import java.util.UUID;

public interface ClienteRecorrenteProjection {

    UUID getId();

    String getNome();

    Long getTotalPedidos();

    BigDecimal getTotalGasto();
}
