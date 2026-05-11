package br.com.meveum.cardapio.produtos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.entity.Produto;
import br.com.meveum.cardapio.produtos.validator.service.ValidarProdutoExisteService;
import br.com.meveum.cardapio.repository.ProdutoRepository;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExcluirProdutoServiceTest {

    @Mock
    private ValidarProdutoExisteService validarProdutoExisteService;

    @Mock
    private ProdutoRepository produtoRepository;

    @InjectMocks
    private ExcluirProdutoService excluirProdutoService;

    @Test
    void deveExcluirProdutoComSoftDelete() {
        var produtoId = UUID.randomUUID();
        var produto = new Produto();
        produto.setActive(true);
        when(validarProdutoExisteService.validar(produtoId)).thenReturn(produto);

        excluirProdutoService.excluir(produtoId);

        assertThat(produto.getActive()).isFalse();
        verify(produtoRepository).save(produto);
    }
}
