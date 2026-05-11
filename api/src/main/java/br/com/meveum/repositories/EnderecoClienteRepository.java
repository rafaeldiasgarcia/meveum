package br.com.meveum.repositories;

import br.com.meveum.entities.EnderecoCliente;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnderecoClienteRepository extends JpaRepository<EnderecoCliente, UUID> {
}
