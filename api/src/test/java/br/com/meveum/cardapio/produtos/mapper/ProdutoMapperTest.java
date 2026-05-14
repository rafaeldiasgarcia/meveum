package br.com.meveum.cardapio.produtos.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.meveum.cardapio.entity.Categoria;
import br.com.meveum.cardapio.entity.Produto;
import br.com.meveum.cardapio.produtos.dto.AtualizarProdutoRequest;
import br.com.meveum.cardapio.produtos.dto.CriarProdutoRequest;
import br.com.meveum.lojas.entity.Loja;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class ProdutoMapperTest {

    private final ProdutoMapper produtoMapper = new ProdutoMapper();

    @Test
    void deveConverterCriarProdutoRequestParaEntity() {
        var request = new CriarProdutoRequest(UUID.randomUUID(), UUID.randomUUID(), "Pizza", "Grande", BigDecimal.TEN, "img", 2);

        var produto = produtoMapper.toEntity(request);

        assertThat(produto.getId()).isNull();
        assertThat(produto.getLoja()).isNull();
        assertThat(produto.getCategoria()).isNull();
        assertThat(produto.getName()).isEqualTo("Pizza");
        assertThat(produto.getDescription()).isEqualTo("Grande");
        assertThat(produto.getBasePrice()).isEqualTo(BigDecimal.TEN);
        assertThat(produto.getImageUrl()).isEqualTo("img");
        assertThat(produto.getSortOrder()).isEqualTo(2);
        assertThat(produto.getActive()).isTrue();
        assertThat(produto.getAvailable()).isTrue();
    }

    @Test
    void deveUsarOrdemPadraoAoConverterCriarProdutoRequestParaEntity() {
        var request = new CriarProdutoRequest(UUID.randomUUID(), UUID.randomUUID(), "Pizza", null, BigDecimal.TEN, null, null);

        var produto = produtoMapper.toEntity(request);

        assertThat(produto.getSortOrder()).isZero();
    }

    @Test
    void deveConverterEntityParaCriarProdutoResponse() {
        var produto = produto();

        var response = produtoMapper.toCriarProdutoResponse(produto);

        assertThat(response.id()).isEqualTo(produto.getId());
        assertThat(response.lojaId()).isEqualTo(produto.getLoja().getId());
        assertThat(response.categoriaId()).isEqualTo(produto.getCategoria().getId());
        assertThat(response.nome()).isEqualTo(produto.getName());
        assertThat(response.preco()).isEqualTo(produto.getBasePrice());
        assertThat(response.disponivel()).isTrue();
        assertThat(response.criadoEm()).isEqualTo(produto.getCreatedAt());
    }

    @Test
    void deveConverterEntityParaListarProdutoResponse() {
        var produto = produto();

        var response = produtoMapper.toListarProdutoResponse(produto);

        assertThat(response.id()).isEqualTo(produto.getId());
        assertThat(response.lojaId()).isEqualTo(produto.getLoja().getId());
        assertThat(response.categoriaId()).isEqualTo(produto.getCategoria().getId());
        assertThat(response.nome()).isEqualTo(produto.getName());
        assertThat(response.preco()).isEqualTo(produto.getBasePrice());
        assertThat(response.disponivel()).isTrue();
    }

    @Test
    void deveConverterEntityParaDetalharProdutoResponse() {
        var produto = produto();

        var response = produtoMapper.toDetalharProdutoResponse(produto);

        assertThat(response.id()).isEqualTo(produto.getId());
        assertThat(response.lojaId()).isEqualTo(produto.getLoja().getId());
        assertThat(response.categoriaId()).isEqualTo(produto.getCategoria().getId());
        assertThat(response.nome()).isEqualTo(produto.getName());
        assertThat(response.disponivel()).isTrue();
        assertThat(response.atualizadoEm()).isEqualTo(produto.getUpdatedAt());
    }

    @Test
    void deveConverterEntityParaAtualizarProdutoResponse() {
        var produto = produto();

        var response = produtoMapper.toAtualizarProdutoResponse(produto);

        assertThat(response.id()).isEqualTo(produto.getId());
        assertThat(response.lojaId()).isEqualTo(produto.getLoja().getId());
        assertThat(response.categoriaId()).isEqualTo(produto.getCategoria().getId());
        assertThat(response.nome()).isEqualTo(produto.getName());
        assertThat(response.ativo()).isEqualTo(produto.getActive());
        assertThat(response.disponivel()).isEqualTo(produto.getAvailable());
    }

    @Test
    void deveAtualizarEntityComAtualizarProdutoRequest() {
        var produto = produto();
        var request = new AtualizarProdutoRequest(UUID.randomUUID(), "Calzone", "Recheado", BigDecimal.valueOf(30), "nova", 4, false);

        produtoMapper.toEntity(request, produto);

        assertThat(produto.getName()).isEqualTo("Calzone");
        assertThat(produto.getDescription()).isEqualTo("Recheado");
        assertThat(produto.getBasePrice()).isEqualTo(BigDecimal.valueOf(30));
        assertThat(produto.getImageUrl()).isEqualTo("nova");
        assertThat(produto.getSortOrder()).isEqualTo(4);
        assertThat(produto.getActive()).isFalse();
    }

    private Produto produto() {
        var loja = new Loja();
        loja.setId(UUID.randomUUID());
        var categoria = new Categoria();
        categoria.setId(UUID.randomUUID());

        var produto = new Produto();
        produto.setId(UUID.randomUUID());
        produto.setLoja(loja);
        produto.setCategoria(categoria);
        produto.setName("Pizza");
        produto.setDescription("Grande");
        produto.setBasePrice(BigDecimal.TEN);
        produto.setImageUrl("img");
        produto.setSortOrder(2);
        produto.setActive(true);
        produto.setAvailable(true);
        produto.setCreatedAt(OffsetDateTime.now().minusDays(1));
        produto.setUpdatedAt(OffsetDateTime.now());
        return produto;
    }
}
