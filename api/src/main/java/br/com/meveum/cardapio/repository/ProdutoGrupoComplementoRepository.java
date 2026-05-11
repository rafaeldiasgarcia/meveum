package br.com.meveum.cardapio.repository;

import br.com.meveum.cardapio.entity.ProdutoGrupoComplemento;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoGrupoComplementoRepository extends JpaRepository<ProdutoGrupoComplemento, UUID> {

    List<ProdutoGrupoComplemento> findByProdutoIdOrderBySortOrderAsc(UUID produtoId);

    Optional<ProdutoGrupoComplemento> findByProdutoIdAndGrupoComplementoId(UUID produtoId, UUID grupoComplementoId);
}
