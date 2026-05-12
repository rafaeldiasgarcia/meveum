package br.com.meveum.dashboard.validator;

import br.com.meveum.shared.exception.RegraNegocioException;
import java.time.OffsetDateTime;
import org.springframework.stereotype.Component;

@Component
public class DashboardValidator {

    private static final int LIMITE_MAXIMO_PRODUTOS = 50;

    public void validarPeriodo(OffsetDateTime inicio, OffsetDateTime fim) {
        if (inicio == null) {
            throw new RegraNegocioException("Data inicial do dashboard e obrigatoria.");
        }

        if (fim == null) {
            throw new RegraNegocioException("Data final do dashboard e obrigatoria.");
        }

        if (inicio.isAfter(fim)) {
            throw new RegraNegocioException("Data inicial do dashboard nao pode ser maior que a final.");
        }
    }

    public void validarLimite(Integer limite) {
        if (limite == null) {
            throw new RegraNegocioException("Limite de produtos do dashboard e obrigatorio.");
        }

        if (limite <= 0) {
            throw new RegraNegocioException("Limite de produtos do dashboard deve ser maior que zero.");
        }

        if (limite > LIMITE_MAXIMO_PRODUTOS) {
            throw new RegraNegocioException("Limite de produtos do dashboard deve ser menor ou igual a 50.");
        }
    }
}
