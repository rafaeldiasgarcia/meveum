package br.com.meveum.cardapio.repository;

import br.com.meveum.cardapio.entity.GrupoComplemento;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrupoComplementoRepository extends JpaRepository<GrupoComplemento, UUID> {
}
