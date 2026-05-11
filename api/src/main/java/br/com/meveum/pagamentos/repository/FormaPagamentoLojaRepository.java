package br.com.meveum.pagamentos.repository;

import br.com.meveum.pagamentos.entity.FormaPagamentoLoja;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FormaPagamentoLojaRepository extends JpaRepository<FormaPagamentoLoja, UUID> {
}
