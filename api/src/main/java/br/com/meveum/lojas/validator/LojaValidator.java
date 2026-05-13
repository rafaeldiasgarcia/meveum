package br.com.meveum.lojas.validator;

import br.com.meveum.lojas.dto.AtualizarHorarioFuncionamentoRequest;
import br.com.meveum.lojas.dto.AtualizarLojaRequest;
import br.com.meveum.lojas.dto.AtualizarPausaManualLojaRequest;
import br.com.meveum.lojas.dto.AtualizarStatusLojaRequest;
import br.com.meveum.shared.exception.RegraNegocioException;
import org.springframework.stereotype.Component;

@Component
public class LojaValidator {

    private static final String SLUG_PATTERN = "^[a-z0-9]+(?:-[a-z0-9]+)*$";

    public void validarAtualizacao(AtualizarLojaRequest request) {
        validarNome(request.nome());
        validarSlug(request.slug());
        validarWhatsapp(request.whatsappNumber());
    }

    public void validarPausaManual(AtualizarPausaManualLojaRequest request) {
        if (request.pausadaManualmente() == null) {
            throw new RegraNegocioException("Pausa manual da loja e obrigatoria.");
        }
    }

    public void validarHorarioFuncionamento(AtualizarHorarioFuncionamentoRequest request) {
        if (request.diaSemana() < 1 || request.diaSemana() > 7) {
            throw new RegraNegocioException("Dia da semana do horario e invalido.");
        }

        if (!request.fechamento().isAfter(request.abertura())) {
            throw new RegraNegocioException("Horario de fechamento deve ser maior que abertura.");
        }
    }

    public void validarStatus(AtualizarStatusLojaRequest request) {
        if (request.status() == null) {
            throw new RegraNegocioException("Status da loja e obrigatorio.");
        }
    }

    private void validarNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new RegraNegocioException("Nome da loja e obrigatorio.");
        }
    }

    private void validarSlug(String slug) {
        if (slug == null || slug.isBlank()) {
            throw new RegraNegocioException("Slug da loja e obrigatorio.");
        }

        if (!slug.matches(SLUG_PATTERN)) {
            throw new RegraNegocioException("Slug da loja deve conter apenas letras minusculas, numeros e hifens.");
        }
    }

    private void validarWhatsapp(String whatsappNumber) {
        if (whatsappNumber == null || whatsappNumber.isBlank()) {
            throw new RegraNegocioException("WhatsApp da loja e obrigatorio.");
        }
    }
}
