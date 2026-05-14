package br.com.meveum.crm.repository;

import br.com.meveum.crm.entity.Cliente;
import br.com.meveum.crm.repository.projection.ClienteEstatisticaProjection;
import br.com.meveum.crm.repository.projection.ClienteRecorrenteProjection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClienteRepository extends JpaRepository<Cliente, UUID> {

    List<Cliente> findByLojaIdOrderByNameAsc(UUID lojaId);

    @Query("""
        select cliente
          from Cliente cliente
         where cliente.loja.id = :lojaId
           and (
                lower(cliente.name) like lower(concat('%', :termo, '%'))
             or cliente.phone like concat('%', :termo, '%')
           )
         order by cliente.name asc
        """)
    List<Cliente> buscarPorLojaETermo(@Param("lojaId") UUID lojaId, @Param("termo") String termo);

    @Query(value = """
        select
            c.id as id,
            c.store_id as lojaId,
            c.name as nome,
            c.phone as telefone,
            coalesce(sum(case when o.status <> 'CANCELED' then 1 else 0 end), 0) as totalPedidos,
            coalesce(sum(case when o.status <> 'CANCELED' then o.total else 0 end), 0) as totalGasto,
            max(case when o.status <> 'CANCELED' then o.created_at end) as ultimoPedido,
            c.created_at as criadoEm
        from customers c
        left join orders o on o.customer_id = c.id
        where c.store_id = :lojaId
          and (
                :termo is null
             or :termo = ''
             or lower(c.name) like lower(concat('%', :termo, '%'))
             or c.phone like concat('%', :termo, '%')
          )
        group by c.id, c.store_id, c.name, c.phone, c.created_at
        order by c.name asc
        """, nativeQuery = true)
    List<ClienteEstatisticaProjection> listarComEstatisticas(
        @Param("lojaId") UUID lojaId,
        @Param("termo") String termo
    );

    @Query(value = """
        select
            c.id as id,
            c.name as nome,
            count(o.id) as totalPedidos,
            coalesce(sum(case when o.status <> 'CANCELED' then o.total else 0 end), 0) as totalGasto
        from customers c
        join orders o on o.customer_id = c.id
        where c.store_id = :lojaId
          and o.status = 'DONE'
        group by c.id, c.name
        having count(o.id) > 1
        order by count(o.id) desc, coalesce(sum(o.total), 0) desc
        """, nativeQuery = true)
    List<ClienteRecorrenteProjection> listarClientesRecorrentes(@Param("lojaId") UUID lojaId, Pageable pageable);

    Optional<Cliente> findByLojaIdAndPhone(UUID lojaId, String phone);

    boolean existsByLojaIdAndPhone(UUID lojaId, String phone);

    boolean existsByLojaIdAndPhoneAndIdNot(UUID lojaId, String phone, UUID id);
}
