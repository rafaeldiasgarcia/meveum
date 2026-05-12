package br.com.meveum.pagamentos.formas.validator.service;

import br.com.meveum.pagamentos.entity.FormaPagamentoLoja;
import br.com.meveum.pagamentos.repository.FormaPagamentoLojaRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarFormaPagamentoExisteService {

    private final FormaPagamentoLojaRepository formaPagamentoLojaRepository;

    public FormaPagamentoLoja validar(UUID formaPagamentoId) {
        return formaPagamentoLojaRepository.findById(formaPagamentoId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Forma de pagamento nao encontrada."));
    }
}
