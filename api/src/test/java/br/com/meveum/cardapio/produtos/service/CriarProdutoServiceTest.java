package br.com.meveum.cardapio.produtos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.entity.Categoria;
import br.com.meveum.cardapio.entity.Produto;
import br.com.meveum.cardapio.produtos.dto.CriarProdutoRequest;
import br.com.meveum.cardapio.produtos.dto.CriarProdutoResponse;
import br.com.meveum.cardapio.produtos.mapper.ProdutoMapper;
import br.com.meveum.cardapio.produtos.validator.ProdutoValidator;
import br.com.meveum.cardapio.produtos.validator.service.ValidarCategoriaProdutoExisteService;
import br.com.meveum.cardapio.produtos.validator.service.ValidarLojaProdutoExisteService;
import br.com.meveum.cardapio.produtos.validator.service.ValidarNomeProdutoDisponivelService;
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
class CriarProdutoServiceTest {

    @Mock
    private ProdutoValidator produtoValidator;

    @Mock
    private ValidarLojaProdutoExisteService validarLojaProdutoExisteService;

    @Mock
    private ValidarCategoriaProdutoExisteService validarCategoriaProdutoExisteService;

    @Mock
    private ValidarNomeProdutoDisponivelService validarNomeProdutoDisponivelService;

    @Mock
    private ProdutoRepository produtoRepository;

    @Mock
    private ProdutoMapper produtoMapper;

    @InjectMocks
    private CriarProdutoService criarProdutoService;

    @Test
    void deveCriarProduto() {
        var lojaId = UUID.randomUUID();
        var categoriaId = UUID.randomUUID();
        var produtoId = UUID.randomUUID();
        var request = new CriarProdutoRequest(lojaId, categoriaId, "Pizza", "Grande", BigDecimal.TEN, null, 1);
        var loja = new Loja();
        loja.setId(lojaId);
        var categoria = new Categoria();
        categoria.setId(categoriaId);
        var produto = new Produto();
        var produtoSalvo = new Produto();
        produtoSalvo.setId(produtoId);
        var response = new CriarProdutoResponse(produtoId, lojaId, categoriaId, "Pizza", "Grande", BigDecimal.TEN, null, 1, true, null, null);

        when(validarLojaProdutoExisteService.validar(lojaId)).thenReturn(loja);
        when(validarCategoriaProdutoExisteService.validar(categoriaId, lojaId)).thenReturn(categoria);
        when(produtoMapper.toEntity(request)).thenReturn(produto);
        when(produtoRepository.save(produto)).thenReturn(produtoSalvo);
        when(produtoMapper.toCriarProdutoResponse(produtoSalvo)).thenReturn(response);

        var resultado = criarProdutoService.criar(request);

        assertThat(resultado).isEqualTo(response);
        assertThat(produto.getLoja()).isEqualTo(loja);
        assertThat(produto.getCategoria()).isEqualTo(categoria);
        verify(produtoValidator).validarCriacao(request);
        verify(validarNomeProdutoDisponivelService).validarCriacao(lojaId, "Pizza");
    }
}
