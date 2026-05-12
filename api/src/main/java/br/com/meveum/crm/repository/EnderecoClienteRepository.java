package br.com.meveum.crm.repository;

import br.com.meveum.crm.entity.EnderecoCliente;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnderecoClienteRepository extends JpaRepository<EnderecoCliente, UUID> {

    List<EnderecoCliente> findByClienteIdOrderByLabelAscStreetAsc(UUID clienteId);

    Optional<EnderecoCliente> findByIdAndClienteId(UUID id, UUID clienteId);
}
