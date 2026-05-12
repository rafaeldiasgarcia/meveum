package br.com.meveum.pagamentos.formas.validator;

import br.com.meveum.pagamentos.formas.dto.AtualizarFormaPagamentoRequest;
import br.com.meveum.pagamentos.formas.dto.CriarFormaPagamentoRequest;
import br.com.meveum.shared.exception.RegraNegocioException;
import org.springframework.stereotype.Component;

@Component
public class FormaPagamentoValidator {

    public void validarCriacao(CriarFormaPagamentoRequest request) {
        if (request.formaPagamento() == null) {
            throw new RegraNegocioException("Forma de pagamento e obrigatoria.");
        }
    }

    public void validarAtualizacao(AtualizarFormaPagamentoRequest request) {
        if (request.formaPagamento() == null) {
            throw new RegraNegocioException("Forma de pagamento e obrigatoria.");
        }

        if (request.ativo() == null) {
            throw new RegraNegocioException("Status ativo da forma de pagamento e obrigatorio.");
        }
    }
}
