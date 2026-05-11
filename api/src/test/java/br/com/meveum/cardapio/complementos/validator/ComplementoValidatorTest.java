package br.com.meveum.cardapio.complementos.validator;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.meveum.cardapio.complementos.dto.AtualizarGrupoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.AtualizarOpcaoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.CriarGrupoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.CriarOpcaoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.VincularGrupoComplementoProdutoRequest;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class ComplementoValidatorTest {

    private final ComplementoValidator complementoValidator = new ComplementoValidator();

    @Test
    void deveValidarCriacaoGrupoValida() {
        var request = new CriarGrupoComplementoRequest(UUID.randomUUID(), "Bebidas", null, 0, 2, 1);

        assertThatCode(() -> complementoValidator.validarCriacaoGrupo(request)).doesNotThrowAnyException();
    }

    @Test
    void deveFalharQuandoNomeGrupoNaoForInformado() {
        var request = new CriarGrupoComplementoRequest(UUID.randomUUID(), " ", null, 0, 2, 1);

        assertThatThrownBy(() -> complementoValidator.validarCriacaoGrupo(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Nome do grupo de complemento e obrigatorio.");
    }

    @Test
    void deveFalharQuandoQuantidadeMinimaNaoForInformada() {
        var request = new CriarGrupoComplementoRequest(UUID.randomUUID(), "Bebidas", null, null, 2, 1);

        assertThatThrownBy(() -> complementoValidator.validarCriacaoGrupo(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Quantidade minima do grupo de complemento e obrigatoria.");
    }

    @Test
    void deveFalharQuandoQuantidadeMaximaForMenorQueMinima() {
        var request = new AtualizarGrupoComplementoRequest("Bebidas", null, 3, 2, 1, true);

        assertThatThrownBy(() -> complementoValidator.validarAtualizacaoGrupo(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Quantidade maxima deve ser maior ou igual a quantidade minima.");
    }

    @Test
    void deveFalharQuandoQuantidadeMaximaForZero() {
        var request = new CriarGrupoComplementoRequest(UUID.randomUUID(), "Bebidas", null, 0, 0, 1);

        assertThatThrownBy(() -> complementoValidator.validarCriacaoGrupo(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Quantidade maxima do grupo de complemento deve ser maior que zero.");
    }

    @Test
    void deveValidarCriacaoOpcaoValida() {
        var request = new CriarOpcaoComplementoRequest(
            UUID.randomUUID(),
            UUID.randomUUID(),
            "Coca",
            null,
            BigDecimal.TEN,
            1
        );

        assertThatCode(() -> complementoValidator.validarCriacaoOpcao(request)).doesNotThrowAnyException();
    }

    @Test
    void deveFalharQuandoPrecoAdicionalForNegativo() {
        var request = new AtualizarOpcaoComplementoRequest("Coca", null, BigDecimal.valueOf(-1), 1, true);

        assertThatThrownBy(() -> complementoValidator.validarAtualizacaoOpcao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Preco adicional da opcao de complemento nao pode ser negativo.");
    }

    @Test
    void deveFalharQuandoNomeOpcaoNaoForInformado() {
        var request = new CriarOpcaoComplementoRequest(UUID.randomUUID(), UUID.randomUUID(), null, null, BigDecimal.ZERO, 1);

        assertThatThrownBy(() -> complementoValidator.validarCriacaoOpcao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Nome da opcao de complemento e obrigatorio.");
    }

    @Test
    void deveFalharQuandoOrdemForNegativa() {
        var request = new VincularGrupoComplementoProdutoRequest(UUID.randomUUID(), -1);

        assertThatThrownBy(() -> complementoValidator.validarVinculoProdutoGrupo(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Ordem do complemento nao pode ser negativa.");
    }
}
