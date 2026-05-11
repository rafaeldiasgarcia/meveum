package br.com.meveum.validators.categorias.services;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.exceptions.RegraNegocioException;
import br.com.meveum.repositories.CategoriaRepository;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarNomeCategoriaDisponivelServiceTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private ValidarNomeCategoriaDisponivelService validarNomeCategoriaDisponivelService;

    @Test
    void devePermitirCriacaoQuandoNomeEstiverDisponivel() {
        var lojaId = UUID.randomUUID();
        when(categoriaRepository.existsByLojaIdAndNameIgnoreCase(lojaId, "Pizzas")).thenReturn(false);

        assertThatCode(() -> validarNomeCategoriaDisponivelService.validarCriacao(lojaId, "Pizzas"))
            .doesNotThrowAnyException();
    }

    @Test
    void deveFalharNaCriacaoQuandoNomeJaExistir() {
        var lojaId = UUID.randomUUID();
        when(categoriaRepository.existsByLojaIdAndNameIgnoreCase(lojaId, "Pizzas")).thenReturn(true);

        assertThatThrownBy(() -> validarNomeCategoriaDisponivelService.validarCriacao(lojaId, "Pizzas"))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Ja existe uma categoria com esse nome.");
    }

    @Test
    void devePermitirAtualizacaoQuandoNomeEstiverDisponivel() {
        var lojaId = UUID.randomUUID();
        var categoriaId = UUID.randomUUID();
        when(categoriaRepository.existsByLojaIdAndNameIgnoreCaseAndIdNot(lojaId, "Pizzas", categoriaId))
            .thenReturn(false);

        assertThatCode(() -> validarNomeCategoriaDisponivelService.validarAtualizacao(lojaId, categoriaId, "Pizzas"))
            .doesNotThrowAnyException();
    }

    @Test
    void deveFalharNaAtualizacaoQuandoNomeJaExistir() {
        var lojaId = UUID.randomUUID();
        var categoriaId = UUID.randomUUID();
        when(categoriaRepository.existsByLojaIdAndNameIgnoreCaseAndIdNot(lojaId, "Pizzas", categoriaId))
            .thenReturn(true);

        assertThatThrownBy(
            () -> validarNomeCategoriaDisponivelService.validarAtualizacao(lojaId, categoriaId, "Pizzas")
        )
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Ja existe uma categoria com esse nome.");
    }
}
