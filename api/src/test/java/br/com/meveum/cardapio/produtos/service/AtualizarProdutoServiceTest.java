package br.com.meveum.cardapio.produtos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.entity.Categoria;
import br.com.meveum.cardapio.entity.Produto;
import br.com.meveum.cardapio.produtos.dto.AtualizarProdutoRequest;
import br.com.meveum.cardapio.produtos.dto.AtualizarProdutoResponse;
import br.com.meveum.cardapio.produtos.mapper.ProdutoMapper;
import br.com.meveum.cardapio.produtos.validator.ProdutoValidator;
import br.com.meveum.cardapio.produtos.validator.service.ValidarCategoriaProdutoExisteService;
import br.com.meveum.cardapio.produtos.validator.service.ValidarNomeProdutoDisponivelService;
import br.com.meveum.cardapio.produtos.validator.service.ValidarProdutoExisteService;
import br.com.meveum.cardapio.repository.ProdutoRepository;
import br.com.meveum.lojas.entity.Loja;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AtualizarProdutoServiceTest {

    @Mock
    private ProdutoValidator produtoValidator;

    @Mock
    private ValidarProdutoExisteService validarProdutoExisteService;

    @Mock
    private ValidarCategoriaProdutoExisteService validarCategoriaProdutoExisteService;

    @Mock
    private ValidarNomeProdutoDisponivelService validarNomeProdutoDisponivelService;

    @Mock
    private ProdutoRepository produtoRepository;

    @Mock
    private ProdutoMapper produtoMapper;

    @InjectMocks
    private AtualizarProdutoService atualizarProdutoService;

    @Test
    void deveAtualizarProduto() {
        var lojaId = UUID.randomUUID();
        var categoriaId = UUID.randomUUID();
        var produtoId = UUID.randomUUID();
        var request = new AtualizarProdutoRequest(categoriaId, "Pizza", "Grande", BigDecimal.TEN, null, 1, true);
        var loja = new Loja();
        loja.setId(lojaId);
        var categoria = new Categoria();
        categoria.setId(categoriaId);
        var produto = new Produto();
        produto.setLoja(loja);
        var response = AtualizarProdutoResponse.builder().id(produtoId).preco(BigDecimal.TEN).build();

        when(validarProdutoExisteService.validar(produtoId)).thenReturn(produto);
        when(validarCategoriaProdutoExisteService.validar(categoriaId, lojaId)).thenReturn(categoria);
        when(produtoRepository.save(produto)).thenReturn(produto);
        when(produtoMapper.toAtualizarProdutoResponse(produto)).thenReturn(response);

        var resultado = atualizarProdutoService.atualizar(produtoId, request);

        assertThat(resultado).isEqualTo(response);
        assertThat(produto.getCategoria()).isEqualTo(categoria);
        verify(produtoValidator).validarAtualizacao(request);
        verify(validarNomeProdutoDisponivelService).validarAtualizacao(lojaId, produtoId, "Pizza");
        verify(produtoMapper).toEntity(request, produto);
    }
}
