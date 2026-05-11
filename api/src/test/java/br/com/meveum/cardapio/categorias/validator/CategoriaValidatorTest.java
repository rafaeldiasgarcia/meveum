package br.com.meveum.cardapio.categorias.validator;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.meveum.cardapio.categorias.dto.AtualizarCategoriaRequest;
import br.com.meveum.cardapio.categorias.dto.CriarCategoriaRequest;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class CategoriaValidatorTest {

    private final CategoriaValidator categoriaValidator = new CategoriaValidator();

    @Test
    void deveValidarCriacaoComDadosValidos() {
        var request = new CriarCategoriaRequest(UUID.randomUUID(), "Pizzas", null, 0);

        assertThatCode(() -> categoriaValidator.validarCriacao(request)).doesNotThrowAnyException();
    }

    @Test
    void deveFalharAoValidarCriacaoComNomeNulo() {
        var request = new CriarCategoriaRequest(UUID.randomUUID(), null, null, 0);

        assertThatThrownBy(() -> categoriaValidator.validarCriacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Nome da categoria e obrigatorio.");
    }

    @Test
    void deveFalharAoValidarCriacaoComNomeEmBranco() {
        var request = new CriarCategoriaRequest(UUID.randomUUID(), " ", null, 0);

        assertThatThrownBy(() -> categoriaValidator.validarCriacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Nome da categoria e obrigatorio.");
    }

    @Test
    void deveFalharAoValidarCriacaoComOrdemNegativa() {
        var request = new CriarCategoriaRequest(UUID.randomUUID(), "Pizzas", null, -1);

        assertThatThrownBy(() -> categoriaValidator.validarCriacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Ordem da categoria nao pode ser negativa.");
    }

    @Test
    void deveValidarAtualizacaoComDadosValidos() {
        var request = new AtualizarCategoriaRequest("Pizzas", null, 1, true);

        assertThatCode(() -> categoriaValidator.validarAtualizacao(request)).doesNotThrowAnyException();
    }

    @Test
    void deveFalharAoValidarAtualizacaoComNomeNulo() {
        var request = new AtualizarCategoriaRequest(null, null, 0, true);

        assertThatThrownBy(() -> categoriaValidator.validarAtualizacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Nome da categoria e obrigatorio.");
    }

    @Test
    void deveFalharAoValidarAtualizacaoComOrdemNegativa() {
        var request = new AtualizarCategoriaRequest("Pizzas", null, -1, true);

        assertThatThrownBy(() -> categoriaValidator.validarAtualizacao(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Ordem da categoria nao pode ser negativa.");
    }
}
