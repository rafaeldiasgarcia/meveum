package br.com.meveum.cardapio.produtos.validator.service;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.repository.ProdutoRepository;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarNomeProdutoDisponivelServiceTest {

    @Mock
    private ProdutoRepository produtoRepository;

    @InjectMocks
    private ValidarNomeProdutoDisponivelService validarNomeProdutoDisponivelService;

    @Test
    void devePermitirCriacaoQuandoNomeEstiverDisponivel() {
        var lojaId = UUID.randomUUID();
        when(produtoRepository.existsByLojaIdAndNameIgnoreCase(lojaId, "Pizza")).thenReturn(false);

        assertThatCode(() -> validarNomeProdutoDisponivelService.validarCriacao(lojaId, "Pizza"))
            .doesNotThrowAnyException();
    }

    @Test
    void deveFalharNaCriacaoQuandoNomeJaExistir() {
        var lojaId = UUID.randomUUID();
        when(produtoRepository.existsByLojaIdAndNameIgnoreCase(lojaId, "Pizza")).thenReturn(true);

        assertThatThrownBy(() -> validarNomeProdutoDisponivelService.validarCriacao(lojaId, "Pizza"))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Ja existe um produto com esse nome.");
    }

    @Test
    void devePermitirAtualizacaoQuandoNomeEstiverDisponivel() {
        var lojaId = UUID.randomUUID();
        var produtoId = UUID.randomUUID();
        when(produtoRepository.existsByLojaIdAndNameIgnoreCaseAndIdNot(lojaId, "Pizza", produtoId))
            .thenReturn(false);

        assertThatCode(() -> validarNomeProdutoDisponivelService.validarAtualizacao(lojaId, produtoId, "Pizza"))
            .doesNotThrowAnyException();
    }

    @Test
    void deveFalharNaAtualizacaoQuandoNomeJaExistir() {
        var lojaId = UUID.randomUUID();
        var produtoId = UUID.randomUUID();
        when(produtoRepository.existsByLojaIdAndNameIgnoreCaseAndIdNot(lojaId, "Pizza", produtoId))
            .thenReturn(true);

        assertThatThrownBy(() -> validarNomeProdutoDisponivelService.validarAtualizacao(lojaId, produtoId, "Pizza"))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Ja existe um produto com esse nome.");
    }
}
