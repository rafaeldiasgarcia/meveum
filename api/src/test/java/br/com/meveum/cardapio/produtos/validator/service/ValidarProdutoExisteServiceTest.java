package br.com.meveum.cardapio.produtos.validator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.entity.Produto;
import br.com.meveum.cardapio.repository.ProdutoRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarProdutoExisteServiceTest {

    @Mock
    private ProdutoRepository produtoRepository;

    @InjectMocks
    private ValidarProdutoExisteService validarProdutoExisteService;

    @Test
    void deveRetornarProdutoQuandoExistir() {
        var produtoId = UUID.randomUUID();
        var produto = new Produto();
        when(produtoRepository.findById(produtoId)).thenReturn(Optional.of(produto));

        assertThat(validarProdutoExisteService.validar(produtoId)).isEqualTo(produto);
    }

    @Test
    void deveFalharQuandoProdutoNaoExistir() {
        var produtoId = UUID.randomUUID();
        when(produtoRepository.findById(produtoId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> validarProdutoExisteService.validar(produtoId))
            .isInstanceOf(RecursoNaoEncontradoException.class)
            .hasMessage("Produto nao encontrado.");
    }

    @Test
    void deveRetornarProdutoDaLojaQuandoExistir() {
        var produtoId = UUID.randomUUID();
        var lojaId = UUID.randomUUID();
        var produto = new Produto();
        when(produtoRepository.findByIdAndLojaId(produtoId, lojaId)).thenReturn(Optional.of(produto));

        assertThat(validarProdutoExisteService.validar(produtoId, lojaId)).isEqualTo(produto);
    }

    @Test
    void deveFalharQuandoProdutoDaLojaNaoExistir() {
        var produtoId = UUID.randomUUID();
        var lojaId = UUID.randomUUID();
        when(produtoRepository.findByIdAndLojaId(produtoId, lojaId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> validarProdutoExisteService.validar(produtoId, lojaId))
            .isInstanceOf(RecursoNaoEncontradoException.class)
            .hasMessage("Produto nao encontrado.");
    }
}
