package br.com.meveum.crm.repository;

import br.com.meveum.crm.entity.Cliente;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, UUID> {

    List<Cliente> findByLojaIdOrderByNameAsc(UUID lojaId);

    Optional<Cliente> findByLojaIdAndPhone(UUID lojaId, String phone);

    boolean existsByLojaIdAndPhone(UUID lojaId, String phone);

    boolean existsByLojaIdAndPhoneAndIdNot(UUID lojaId, String phone, UUID id);
}
