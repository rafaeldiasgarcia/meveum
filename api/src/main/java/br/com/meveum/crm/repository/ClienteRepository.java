package br.com.meveum.crm.repository;

import br.com.meveum.crm.entity.Cliente;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
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

    Optional<Cliente> findByLojaIdAndPhone(UUID lojaId, String phone);

    boolean existsByLojaIdAndPhone(UUID lojaId, String phone);

    boolean existsByLojaIdAndPhoneAndIdNot(UUID lojaId, String phone, UUID id);
}
