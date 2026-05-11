package br.com.meveum.cardapio.repository;

import br.com.meveum.cardapio.entity.Produto;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, UUID> {

    List<Produto> findByLojaIdAndCategoriaIdOrderBySortOrderAsc(UUID lojaId, UUID categoriaId);
}
