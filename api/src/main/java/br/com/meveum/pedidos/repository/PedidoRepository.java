package br.com.meveum.pedidos.repository;

import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PedidoRepository extends JpaRepository<Pedido, UUID> {

    List<Pedido> findByLojaIdOrderByCreatedAtDesc(UUID lojaId);

    List<Pedido> findByLojaIdAndStatusOrderByCreatedAtDesc(UUID lojaId, StatusPedido status);

    long countByLojaIdAndStatusAndCreatedAtBetween(UUID lojaId, StatusPedido status, OffsetDateTime inicio, OffsetDateTime fim);

    @Query("""
        select coalesce(sum(p.total), 0)
        from Pedido p
        where p.loja.id = :lojaId
          and p.status <> br.com.meveum.pedidos.entity.enums.StatusPedido.CANCELED
          and p.createdAt between :inicio and :fim
        """)
    BigDecimal somarFaturamentoPorLojaEPeriodo(
        @Param("lojaId") UUID lojaId,
        @Param("inicio") OffsetDateTime inicio,
        @Param("fim") OffsetDateTime fim
    );

    @Query("""
        select count(p)
        from Pedido p
        where p.loja.id = :lojaId
          and p.status <> br.com.meveum.pedidos.entity.enums.StatusPedido.CANCELED
          and p.createdAt between :inicio and :fim
        """)
    long contarPedidosValidosPorLojaEPeriodo(
        @Param("lojaId") UUID lojaId,
        @Param("inicio") OffsetDateTime inicio,
        @Param("fim") OffsetDateTime fim
    );
}
