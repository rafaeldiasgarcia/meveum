package br.com.meveum.repositories;

import br.com.meveum.entities.OpcaoComplemento;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OpcaoComplementoRepository extends JpaRepository<OpcaoComplemento, UUID> {
}
