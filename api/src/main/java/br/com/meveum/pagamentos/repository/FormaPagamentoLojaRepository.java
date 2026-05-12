package br.com.meveum.pagamentos.repository;

import br.com.meveum.pagamentos.entity.FormaPagamentoLoja;
import br.com.meveum.pagamentos.entity.enums.FormaPagamento;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FormaPagamentoLojaRepository extends JpaRepository<FormaPagamentoLoja, UUID> {

    List<FormaPagamentoLoja> findByLojaIdOrderByMethodAsc(UUID lojaId);

    Optional<FormaPagamentoLoja> findByIdAndLojaId(UUID id, UUID lojaId);

    boolean existsByLojaIdAndMethod(UUID lojaId, FormaPagamento method);

    boolean existsByLojaIdAndMethodAndActiveTrue(UUID lojaId, FormaPagamento method);

    boolean existsByLojaIdAndMethodAndIdNot(UUID lojaId, FormaPagamento method, UUID id);
}
