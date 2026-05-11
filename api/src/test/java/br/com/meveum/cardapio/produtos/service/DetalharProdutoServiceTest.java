package br.com.meveum.cardapio.produtos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.entity.Produto;
import br.com.meveum.cardapio.produtos.dto.DetalharProdutoResponse;
import br.com.meveum.cardapio.produtos.mapper.ProdutoMapper;
import br.com.meveum.cardapio.produtos.validator.service.ValidarProdutoExisteService;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DetalharProdutoServiceTest {

    @Mock
    private ValidarProdutoExisteService validarProdutoExisteService;

    @Mock
    private ProdutoMapper produtoMapper;

    @InjectMocks
    private DetalharProdutoService detalharProdutoService;

    @Test
    void deveDetalharProduto() {
        var produtoId = UUID.randomUUID();
        var produto = new Produto();
        var response = DetalharProdutoResponse.builder().id(produtoId).preco(BigDecimal.TEN).build();
        when(validarProdutoExisteService.validar(produtoId)).thenReturn(produto);
        when(produtoMapper.toDetalharProdutoResponse(produto)).thenReturn(response);

        var resultado = detalharProdutoService.detalhar(produtoId);

        assertThat(resultado).isEqualTo(response);
    }
}
