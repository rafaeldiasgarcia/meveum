package br.com.meveum.pedidos.repository;

import br.com.meveum.pedidos.entity.Pedido;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import br.com.meveum.pedidos.repository.projection.FaturamentoDiaProjection;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PedidoRepository extends JpaRepository<Pedido, UUID> {

    List<Pedido> findByLojaIdOrderByCreatedAtDesc(UUID lojaId);

    List<Pedido> findByLojaIdAndStatusOrderByCreatedAtDesc(UUID lojaId, StatusPedido status);

    List<Pedido> findByLojaIdAndStatusOrderByUpdatedAtAsc(UUID lojaId, StatusPedido status);

    List<Pedido> findByLojaIdAndStatusNotInOrderByCreatedAtDesc(
        UUID lojaId,
        List<StatusPedido> statuses,
        Pageable pageable
    );

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

    @Query(value = """
        select coalesce(avg(extract(epoch from (updated_at - created_at)) / 60), 0)
        from orders
        where store_id = :lojaId
          and status = 'DONE'
          and created_at between :inicio and :fim
        """, nativeQuery = true)
    Double calcularTempoMedioCozinhaMinutos(
        @Param("lojaId") UUID lojaId,
        @Param("inicio") OffsetDateTime inicio,
        @Param("fim") OffsetDateTime fim
    );

    @Query(value = """
        select
            cast(extract(isodow from created_at) as int) as diaSemana,
            coalesce(sum(total), 0) as valor
        from orders
        where store_id = :lojaId
          and status = 'DONE'
          and created_at between :inicio and :fim
        group by cast(extract(isodow from created_at) as int)
        order by cast(extract(isodow from created_at) as int)
        """, nativeQuery = true)
    List<FaturamentoDiaProjection> listarFaturamentoPorDiaSemana(
        @Param("lojaId") UUID lojaId,
        @Param("inicio") OffsetDateTime inicio,
        @Param("fim") OffsetDateTime fim
    );
}
