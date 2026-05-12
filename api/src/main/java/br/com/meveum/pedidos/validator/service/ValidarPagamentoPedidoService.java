package br.com.meveum.pedidos.validator.service;

import br.com.meveum.pagamentos.entity.enums.FormaPagamento;
import br.com.meveum.pagamentos.repository.FormaPagamentoLojaRepository;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarPagamentoPedidoService {

    private final FormaPagamentoLojaRepository formaPagamentoLojaRepository;

    public void validar(UUID lojaId, FormaPagamento formaPagamento) {
        if (!formaPagamentoLojaRepository.existsByLojaIdAndMethodAndActiveTrue(lojaId, formaPagamento)) {
            throw new RegraNegocioException("Forma de pagamento nao esta ativa para a loja.");
        }
    }
}
