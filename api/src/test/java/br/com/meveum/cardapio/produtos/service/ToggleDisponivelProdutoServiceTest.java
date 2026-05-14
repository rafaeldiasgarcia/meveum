package br.com.meveum.cardapio.produtos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.entity.Produto;
import br.com.meveum.cardapio.produtos.dto.DetalharProdutoResponse;
import br.com.meveum.cardapio.produtos.mapper.ProdutoMapper;
import br.com.meveum.cardapio.produtos.validator.service.ValidarProdutoExisteService;
import br.com.meveum.cardapio.repository.ProdutoRepository;
import br.com.meveum.lojas.entity.Loja;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ToggleDisponivelProdutoServiceTest {

    @Mock
    private ValidarProdutoExisteService validarProdutoExisteService;
    @Mock
    private ValidarAcessoLojaService validarAcessoLojaService;
    @Mock
    private ProdutoRepository produtoRepository;
    @Mock
    private ProdutoMapper produtoMapper;
    @InjectMocks
    private ToggleDisponivelProdutoService service;

    @Test
    void deveAlternarDisponibilidadeDoProduto() {
        var produtoId = UUID.randomUUID();
        var lojaId = UUID.randomUUID();
        var loja = new Loja();
        loja.setId(lojaId);
        var produto = new Produto();
        produto.setLoja(loja);
        produto.setActive(true);
        var response = DetalharProdutoResponse.builder()
            .id(produtoId)
            .ativo(false)
            .disponivel(false)
            .build();

        when(validarProdutoExisteService.validar(produtoId)).thenReturn(produto);
        when(produtoRepository.save(produto)).thenReturn(produto);
        when(produtoMapper.toDetalharProdutoResponse(produto)).thenReturn(response);

        var resultado = service.toggle(produtoId);

        assertThat(resultado).isEqualTo(response);
        assertThat(produto.getActive()).isFalse();
        verify(validarAcessoLojaService).validar(lojaId);
    }
}
