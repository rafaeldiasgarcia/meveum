package br.com.meveum.cardapio.produtos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.entity.Produto;
import br.com.meveum.cardapio.produtos.dto.ListarProdutoResponse;
import br.com.meveum.cardapio.produtos.mapper.ProdutoMapper;
import br.com.meveum.cardapio.produtos.validator.service.ValidarCategoriaProdutoExisteService;
import br.com.meveum.cardapio.produtos.validator.service.ValidarLojaProdutoExisteService;
import br.com.meveum.cardapio.repository.ProdutoRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ListarProdutoServiceTest {

    @Mock
    private ValidarLojaProdutoExisteService validarLojaProdutoExisteService;

    @Mock
    private ValidarCategoriaProdutoExisteService validarCategoriaProdutoExisteService;

    @Mock
    private ProdutoRepository produtoRepository;

    @Mock
    private ProdutoMapper produtoMapper;

    @InjectMocks
    private ListarProdutoService listarProdutoService;

    @Test
    void deveListarProdutosDaLoja() {
        var lojaId = UUID.randomUUID();
        var produto = new Produto();
        var response = ListarProdutoResponse.builder().id(UUID.randomUUID()).preco(BigDecimal.TEN).build();
        when(produtoRepository.findByLojaIdOrderBySortOrderAsc(lojaId)).thenReturn(List.of(produto));
        when(produtoMapper.toListarProdutoResponse(produto)).thenReturn(response);

        var resultado = listarProdutoService.listar(lojaId, null);

        assertThat(resultado).containsExactly(response);
        verify(validarLojaProdutoExisteService).validar(lojaId);
        verifyNoInteractions(validarCategoriaProdutoExisteService);
    }

    @Test
    void deveListarProdutosDaCategoria() {
        var lojaId = UUID.randomUUID();
        var categoriaId = UUID.randomUUID();
        var produto = new Produto();
        var response = ListarProdutoResponse.builder().id(UUID.randomUUID()).preco(BigDecimal.TEN).build();
        when(produtoRepository.findByLojaIdAndCategoriaIdOrderBySortOrderAsc(lojaId, categoriaId))
            .thenReturn(List.of(produto));
        when(produtoMapper.toListarProdutoResponse(produto)).thenReturn(response);

        var resultado = listarProdutoService.listar(lojaId, categoriaId);

        assertThat(resultado).containsExactly(response);
        verify(validarLojaProdutoExisteService).validar(lojaId);
        verify(validarCategoriaProdutoExisteService).validar(categoriaId, lojaId);
    }
}
