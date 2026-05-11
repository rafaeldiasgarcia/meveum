package br.com.meveum.repositories;

import br.com.meveum.entities.Cliente;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, UUID> {

    Optional<Cliente> findByLojaIdAndPhone(UUID lojaId, String phone);
}
