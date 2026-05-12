package br.com.meveum.entrega.areas.validator;

import br.com.meveum.entrega.areas.dto.AtualizarAreaEntregaRequest;
import br.com.meveum.entrega.areas.dto.CriarAreaEntregaRequest;
import br.com.meveum.entrega.entity.enums.TipoAreaEntrega;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;

@Component
public class AreaEntregaValidator {

    public void validarCriacao(CriarAreaEntregaRequest request) {
        validarNome(request.nome());
        validarTipo(request.tipo());
        validarValores(request.taxa(), request.pedidoMinimo(), request.tempoEstimadoMinutos());
        validarCamposPorTipo(request.tipo(), request.bairro(), request.cepInicial(), request.cepFinal(), request.raioKm());
    }

    public void validarAtualizacao(AtualizarAreaEntregaRequest request) {
        validarNome(request.nome());
        validarTipo(request.tipo());
        validarValores(request.taxa(), request.pedidoMinimo(), request.tempoEstimadoMinutos());
        validarCamposPorTipo(request.tipo(), request.bairro(), request.cepInicial(), request.cepFinal(), request.raioKm());
    }

    private void validarNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new RegraNegocioException("Nome da area de entrega e obrigatorio.");
        }
    }

    private void validarTipo(TipoAreaEntrega tipo) {
        if (tipo == null) {
            throw new RegraNegocioException("Tipo da area de entrega e obrigatorio.");
        }
    }

    private void validarValores(BigDecimal taxa, BigDecimal pedidoMinimo, Integer tempoEstimadoMinutos) {
        if (taxa == null) {
            throw new RegraNegocioException("Taxa de entrega e obrigatoria.");
        }

        if (taxa.compareTo(BigDecimal.ZERO) < 0) {
            throw new RegraNegocioException("Taxa de entrega nao pode ser negativa.");
        }

        if (pedidoMinimo != null && pedidoMinimo.compareTo(BigDecimal.ZERO) < 0) {
            throw new RegraNegocioException("Pedido minimo da area de entrega nao pode ser negativo.");
        }

        if (tempoEstimadoMinutos != null && tempoEstimadoMinutos <= 0) {
            throw new RegraNegocioException("Tempo estimado da area de entrega deve ser maior que zero.");
        }
    }

    private void validarCamposPorTipo(
        TipoAreaEntrega tipo,
        String bairro,
        String cepInicial,
        String cepFinal,
        BigDecimal raioKm
    ) {
        if (tipo == TipoAreaEntrega.NEIGHBORHOOD && (bairro == null || bairro.isBlank())) {
            throw new RegraNegocioException("Bairro e obrigatorio para area de entrega por bairro.");
        }

        if (tipo == TipoAreaEntrega.ZIP_RANGE && (cepInicial == null || cepInicial.isBlank() || cepFinal == null || cepFinal.isBlank())) {
            throw new RegraNegocioException("CEP inicial e CEP final sao obrigatorios para area de entrega por faixa de CEP.");
        }

        if (tipo == TipoAreaEntrega.RADIUS && raioKm == null) {
            throw new RegraNegocioException("Raio em km e obrigatorio para area de entrega por raio.");
        }

        if (raioKm != null && raioKm.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RegraNegocioException("Raio em km deve ser maior que zero.");
        }
    }
}
