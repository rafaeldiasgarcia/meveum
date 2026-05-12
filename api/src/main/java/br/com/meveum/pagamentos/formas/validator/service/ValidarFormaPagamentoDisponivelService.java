package br.com.meveum.pagamentos.formas.validator.service;

import br.com.meveum.pagamentos.entity.enums.FormaPagamento;
import br.com.meveum.pagamentos.repository.FormaPagamentoLojaRepository;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarFormaPagamentoDisponivelService {

    private final FormaPagamentoLojaRepository formaPagamentoLojaRepository;

    public void validarCriacao(UUID lojaId, FormaPagamento formaPagamento) {
        if (formaPagamentoLojaRepository.existsByLojaIdAndMethod(lojaId, formaPagamento)) {
            throw new RegraNegocioException("Loja ja possui essa forma de pagamento.");
        }
    }

    public void validarAtualizacao(UUID lojaId, UUID formaPagamentoId, FormaPagamento formaPagamento) {
        if (formaPagamentoLojaRepository.existsByLojaIdAndMethodAndIdNot(lojaId, formaPagamento, formaPagamentoId)) {
            throw new RegraNegocioException("Loja ja possui essa forma de pagamento.");
        }
    }
}
