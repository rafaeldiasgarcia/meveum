package br.com.meveum.repositories;

import br.com.meveum.entities.ProdutoGrupoComplemento;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoGrupoComplementoRepository extends JpaRepository<ProdutoGrupoComplemento, UUID> {
}
