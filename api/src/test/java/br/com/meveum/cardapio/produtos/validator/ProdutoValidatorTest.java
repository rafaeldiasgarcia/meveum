package br.com.meveum.cardapio.produtos.validator;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.meveum.cardapio.produtos.dto.AtualizarProdutoRequest;
import br.com.meveum.cardapio.produtos.dto.CriarProdutoRequest;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class ProdutoValidatorTest {

    private final ProdutoValidator produtoValidator = new ProdutoValidator();

    @Test
    void deveValidarCriacaoComDadosValidos() {
        var request = new CriarProdutoRequest(UUID.randomUUID(), UUID.randomUUID(), "Pizza", null, BigDecimal.TEN, null, 0);

        assertThatCode(() -> produtoValidator.validarCriacao(request)).doesNotThrowAnyException();
    }

    @Test
    void deveFalharAoValidarCriacaoComNomeNulo() {
        var request = new CriarProdutoRequest(UUID.randomUUID(), UUID.randomUUID(), null, null, BigDecimal.TEN, null, 0);

        assertThatThrownBy(() -> produtoValidator.validarCriacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Nome do produto e obrigatorio.");
    }

    @Test
    void deveFalharAoValidarCriacaoComPrecoNulo() {
        var request = new CriarProdutoRequest(UUID.randomUUID(), UUID.randomUUID(), "Pizza", null, null, null, 0);

        assertThatThrownBy(() -> produtoValidator.validarCriacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Preco do produto e obrigatorio.");
    }

    @Test
    void deveFalharAoValidarCriacaoComPrecoNegativo() {
        var request = new CriarProdutoRequest(UUID.randomUUID(), UUID.randomUUID(), "Pizza", null, BigDecimal.valueOf(-1), null, 0);

        assertThatThrownBy(() -> produtoValidator.validarCriacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Preco do produto nao pode ser negativo.");
    }

    @Test
    void deveFalharAoValidarCriacaoComOrdemNegativa() {
        var request = new CriarProdutoRequest(UUID.randomUUID(), UUID.randomUUID(), "Pizza", null, BigDecimal.TEN, null, -1);

        assertThatThrownBy(() -> produtoValidator.validarCriacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Ordem do produto nao pode ser negativa.");
    }

    @Test
    void deveValidarAtualizacaoComDadosValidos() {
        var request = new AtualizarProdutoRequest(UUID.randomUUID(), "Pizza", null, BigDecimal.TEN, null, 1, true);

        assertThatCode(() -> produtoValidator.validarAtualizacao(request)).doesNotThrowAnyException();
    }

    @Test
    void deveFalharAoValidarAtualizacaoComNomeEmBranco() {
        var request = new AtualizarProdutoRequest(UUID.randomUUID(), " ", null, BigDecimal.TEN, null, 1, true);

        assertThatThrownBy(() -> produtoValidator.validarAtualizacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Nome do produto e obrigatorio.");
    }
}
