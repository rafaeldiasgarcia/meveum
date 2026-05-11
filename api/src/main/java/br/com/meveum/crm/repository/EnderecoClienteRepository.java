package br.com.meveum.crm.repository;

import br.com.meveum.crm.entity.EnderecoCliente;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnderecoClienteRepository extends JpaRepository<EnderecoCliente, UUID> {
}
