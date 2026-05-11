package br.com.meveum.repositories;

import br.com.meveum.entities.Produto;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, UUID> {

    List<Produto> findByLojaIdAndCategoriaIdOrderBySortOrderAsc(UUID lojaId, UUID categoriaId);
}
