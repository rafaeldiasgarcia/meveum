package br.com.meveum.mappers;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.meveum.dtos.categorias.AtualizarCategoriaRequest;
import br.com.meveum.dtos.categorias.CriarCategoriaRequest;
import br.com.meveum.entities.Categoria;
import br.com.meveum.entities.Loja;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class CategoriaMapperTest {

    private final CategoriaMapper categoriaMapper = new CategoriaMapper();

    @Test
    void deveConverterCriarCategoriaRequestParaEntity() {
        var lojaId = UUID.randomUUID();
        var request = new CriarCategoriaRequest(lojaId, "Pizzas", "Sabores especiais", 2);

        var categoria = categoriaMapper.toEntity(request);

        assertThat(categoria.getId()).isNull();
        assertThat(categoria.getLoja()).isNull();
        assertThat(categoria.getName()).isEqualTo("Pizzas");
        assertThat(categoria.getDescription()).isEqualTo("Sabores especiais");
        assertThat(categoria.getSortOrder()).isEqualTo(2);
        assertThat(categoria.getActive()).isTrue();
    }

    @Test
    void deveUsarOrdemPadraoAoConverterCriarCategoriaRequestParaEntity() {
        var request = new CriarCategoriaRequest(UUID.randomUUID(), "Bebidas", null, null);

        var categoria = categoriaMapper.toEntity(request);

        assertThat(categoria.getSortOrder()).isZero();
    }

    @Test
    void deveConverterEntityParaCriarCategoriaResponse() {
        var categoria = categoria();

        var response = categoriaMapper.toCriarCategoriaResponse(categoria);

        assertThat(response.id()).isEqualTo(categoria.getId());
        assertThat(response.lojaId()).isEqualTo(categoria.getLoja().getId());
        assertThat(response.nome()).isEqualTo(categoria.getName());
        assertThat(response.descricao()).isEqualTo(categoria.getDescription());
        assertThat(response.ordem()).isEqualTo(categoria.getSortOrder());
        assertThat(response.ativo()).isEqualTo(categoria.getActive());
        assertThat(response.criadoEm()).isEqualTo(categoria.getCreatedAt());
        assertThat(response.atualizadoEm()).isEqualTo(categoria.getUpdatedAt());
    }

    @Test
    void deveConverterEntityParaListarCategoriaResponse() {
        var categoria = categoria();

        var response = categoriaMapper.toListarCategoriaResponse(categoria);

        assertThat(response.id()).isEqualTo(categoria.getId());
        assertThat(response.lojaId()).isEqualTo(categoria.getLoja().getId());
        assertThat(response.nome()).isEqualTo(categoria.getName());
        assertThat(response.descricao()).isEqualTo(categoria.getDescription());
        assertThat(response.ordem()).isEqualTo(categoria.getSortOrder());
        assertThat(response.ativo()).isEqualTo(categoria.getActive());
    }

    @Test
    void deveConverterEntityParaDetalharCategoriaResponse() {
        var categoria = categoria();

        var response = categoriaMapper.toDetalharCategoriaResponse(categoria);

        assertThat(response.id()).isEqualTo(categoria.getId());
        assertThat(response.lojaId()).isEqualTo(categoria.getLoja().getId());
        assertThat(response.nome()).isEqualTo(categoria.getName());
        assertThat(response.descricao()).isEqualTo(categoria.getDescription());
        assertThat(response.ordem()).isEqualTo(categoria.getSortOrder());
        assertThat(response.ativo()).isEqualTo(categoria.getActive());
        assertThat(response.criadoEm()).isEqualTo(categoria.getCreatedAt());
        assertThat(response.atualizadoEm()).isEqualTo(categoria.getUpdatedAt());
    }

    @Test
    void deveConverterEntityParaAtualizarCategoriaResponse() {
        var categoria = categoria();

        var response = categoriaMapper.toAtualizarCategoriaResponse(categoria);

        assertThat(response.id()).isEqualTo(categoria.getId());
        assertThat(response.lojaId()).isEqualTo(categoria.getLoja().getId());
        assertThat(response.nome()).isEqualTo(categoria.getName());
        assertThat(response.descricao()).isEqualTo(categoria.getDescription());
        assertThat(response.ordem()).isEqualTo(categoria.getSortOrder());
        assertThat(response.ativo()).isEqualTo(categoria.getActive());
        assertThat(response.criadoEm()).isEqualTo(categoria.getCreatedAt());
        assertThat(response.atualizadoEm()).isEqualTo(categoria.getUpdatedAt());
    }

    @Test
    void deveAtualizarEntityComAtualizarCategoriaRequest() {
        var categoria = categoria();
        var loja = categoria.getLoja();
        var id = categoria.getId();
        var request = new AtualizarCategoriaRequest("Massas", "Artesanais", 4, false);

        categoriaMapper.toEntity(request, categoria);

        assertThat(categoria.getId()).isEqualTo(id);
        assertThat(categoria.getLoja()).isEqualTo(loja);
        assertThat(categoria.getName()).isEqualTo("Massas");
        assertThat(categoria.getDescription()).isEqualTo("Artesanais");
        assertThat(categoria.getSortOrder()).isEqualTo(4);
        assertThat(categoria.getActive()).isFalse();
    }

    @Test
    void deveIgnorarCamposNulosAoAtualizarEntity() {
        var categoria = categoria();
        var request = new AtualizarCategoriaRequest("Massas", null, null, null);

        categoriaMapper.toEntity(request, categoria);

        assertThat(categoria.getName()).isEqualTo("Massas");
        assertThat(categoria.getDescription()).isEqualTo("Sabores especiais");
        assertThat(categoria.getSortOrder()).isEqualTo(2);
        assertThat(categoria.getActive()).isTrue();
    }

    private Categoria categoria() {
        var loja = new Loja();
        loja.setId(UUID.randomUUID());

        var categoria = new Categoria();
        categoria.setId(UUID.randomUUID());
        categoria.setLoja(loja);
        categoria.setName("Pizzas");
        categoria.setDescription("Sabores especiais");
        categoria.setSortOrder(2);
        categoria.setActive(true);
        categoria.setCreatedAt(OffsetDateTime.now().minusDays(1));
        categoria.setUpdatedAt(OffsetDateTime.now());
        return categoria;
    }
}
