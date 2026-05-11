package br.com.meveum.repositories;

import br.com.meveum.entities.GrupoComplemento;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrupoComplementoRepository extends JpaRepository<GrupoComplemento, UUID> {
}
