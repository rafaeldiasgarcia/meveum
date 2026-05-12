package br.com.meveum.pedidos.validator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.entity.Produto;
import br.com.meveum.cardapio.repository.ProdutoRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ValidarProdutoPedidoServiceTest {

    @Mock
    private ProdutoRepository produtoRepository;
    @InjectMocks
    private ValidarProdutoPedidoService service;

    @Test
    void deveRetornarProdutoAtivoDaLoja() {
        var lojaId = UUID.randomUUID();
        var produtoId = UUID.randomUUID();
        var produto = Produto.builder().active(true).build();
        when(produtoRepository.findByIdAndLojaId(produtoId, lojaId)).thenReturn(Optional.of(produto));

        assertThat(service.validar(lojaId, produtoId)).isEqualTo(produto);
    }

    @Test
    void deveLancarErroQuandoProdutoNaoExistir() {
        var lojaId = UUID.randomUUID();
        var produtoId = UUID.randomUUID();
        when(produtoRepository.findByIdAndLojaId(produtoId, lojaId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.validar(lojaId, produtoId))
            .isInstanceOf(RecursoNaoEncontradoException.class)
            .hasMessage("Produto do pedido nao encontrado.");
    }

    @Test
    void deveLancarErroQuandoProdutoInativo() {
        var lojaId = UUID.randomUUID();
        var produtoId = UUID.randomUUID();
        var produto = Produto.builder().active(false).build();
        when(produtoRepository.findByIdAndLojaId(produtoId, lojaId)).thenReturn(Optional.of(produto));

        assertThatThrownBy(() -> service.validar(lojaId, produtoId))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Produto do pedido nao esta ativo.");
    }
}
