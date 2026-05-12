package br.com.meveum.pedidos.validator.service;

import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.entity.enums.LojaStatus;
import br.com.meveum.shared.exception.RegraNegocioException;
import org.springframework.stereotype.Service;

@Service
public class ValidarLojaPedidoDisponivelService {

    public void validar(Loja loja) {
        if (loja.getStatus() != LojaStatus.ACTIVE) {
            throw new RegraNegocioException("Loja nao esta ativa para receber pedidos.");
        }

        if (Boolean.TRUE.equals(loja.getManuallyPaused())) {
            throw new RegraNegocioException("Loja esta pausada manualmente.");
        }
    }
}
