package br.com.meveum.repositories;

import br.com.meveum.entities.FormaPagamentoLoja;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FormaPagamentoLojaRepository extends JpaRepository<FormaPagamentoLoja, UUID> {
}
