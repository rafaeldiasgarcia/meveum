package br.com.meveum.entrega.areas.validator;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.meveum.entrega.areas.dto.AtualizarAreaEntregaRequest;
import br.com.meveum.entrega.areas.dto.CriarAreaEntregaRequest;
import br.com.meveum.entrega.entity.enums.TipoAreaEntrega;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class AreaEntregaValidatorTest {

    private final AreaEntregaValidator areaEntregaValidator = new AreaEntregaValidator();

    @Test
    void deveValidarCriacaoPorBairro() {
        var request = criarRequest(TipoAreaEntrega.NEIGHBORHOOD, "Centro", null, null, null);

        assertThatCode(() -> areaEntregaValidator.validarCriacao(request)).doesNotThrowAnyException();
    }

    @Test
    void deveValidarCriacaoPorFaixaDeCep() {
        var request = criarRequest(TipoAreaEntrega.ZIP_RANGE, null, "01000000", "01999999", null);

        assertThatCode(() -> areaEntregaValidator.validarCriacao(request)).doesNotThrowAnyException();
    }

    @Test
    void deveValidarCriacaoPorRaio() {
        var request = criarRequest(TipoAreaEntrega.RADIUS, null, null, null, BigDecimal.TEN);

        assertThatCode(() -> areaEntregaValidator.validarCriacao(request)).doesNotThrowAnyException();
    }

    @Test
    void deveFalharQuandoNomeNaoForInformado() {
        var request = new CriarAreaEntregaRequest(UUID.randomUUID(), " ", TipoAreaEntrega.NEIGHBORHOOD, "Centro", null, null, null, BigDecimal.TEN, null, null);

        assertThatThrownBy(() -> areaEntregaValidator.validarCriacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Nome da area de entrega e obrigatorio.");
    }

    @Test
    void deveFalharQuandoTipoNaoForInformado() {
        var request = criarRequest(null, "Centro", null, null, null);

        assertThatThrownBy(() -> areaEntregaValidator.validarCriacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Tipo da area de entrega e obrigatorio.");
    }

    @Test
    void deveFalharQuandoTaxaForNegativa() {
        var request = new AtualizarAreaEntregaRequest("Centro", TipoAreaEntrega.NEIGHBORHOOD, "Centro", null, null, null, BigDecimal.valueOf(-1), null, null, true);

        assertThatThrownBy(() -> areaEntregaValidator.validarAtualizacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Taxa de entrega nao pode ser negativa.");
    }

    @Test
    void deveFalharQuandoBairroNaoForInformadoParaTipoBairro() {
        var request = criarRequest(TipoAreaEntrega.NEIGHBORHOOD, null, null, null, null);

        assertThatThrownBy(() -> areaEntregaValidator.validarCriacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Bairro e obrigatorio para area de entrega por bairro.");
    }

    @Test
    void deveFalharQuandoCepNaoForInformadoParaFaixaDeCep() {
        var request = criarRequest(TipoAreaEntrega.ZIP_RANGE, null, "01000000", null, null);

        assertThatThrownBy(() -> areaEntregaValidator.validarCriacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("CEP inicial e CEP final sao obrigatorios para area de entrega por faixa de CEP.");
    }

    @Test
    void deveFalharQuandoRaioNaoForInformadoParaTipoRaio() {
        var request = criarRequest(TipoAreaEntrega.RADIUS, null, null, null, null);

        assertThatThrownBy(() -> areaEntregaValidator.validarCriacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Raio em km e obrigatorio para area de entrega por raio.");
    }

    private CriarAreaEntregaRequest criarRequest(
        TipoAreaEntrega tipo,
        String bairro,
        String cepInicial,
        String cepFinal,
        BigDecimal raioKm
    ) {
        return new CriarAreaEntregaRequest(
            UUID.randomUUID(),
            "Centro",
            tipo,
            bairro,
            cepInicial,
            cepFinal,
            raioKm,
            BigDecimal.TEN,
            BigDecimal.valueOf(20),
            30
        );
    }
}
