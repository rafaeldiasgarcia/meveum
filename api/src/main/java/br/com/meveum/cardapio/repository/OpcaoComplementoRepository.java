package br.com.meveum.cardapio.repository;

import br.com.meveum.cardapio.entity.OpcaoComplemento;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OpcaoComplementoRepository extends JpaRepository<OpcaoComplemento, UUID> {
}
