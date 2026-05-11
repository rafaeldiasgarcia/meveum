package br.com.meveum.cardapio.complementos.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.meveum.cardapio.complementos.dto.AtualizarGrupoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.AtualizarOpcaoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.CriarGrupoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.CriarOpcaoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.VincularGrupoComplementoProdutoRequest;
import br.com.meveum.cardapio.entity.GrupoComplemento;
import br.com.meveum.cardapio.entity.OpcaoComplemento;
import br.com.meveum.cardapio.entity.Produto;
import br.com.meveum.cardapio.entity.ProdutoGrupoComplemento;
import br.com.meveum.lojas.entity.Loja;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class ComplementoMapperTest {

    private final ComplementoMapper complementoMapper = new ComplementoMapper();

    @Test
    void deveConverterCriarGrupoComplementoRequestParaEntity() {
        var request = new CriarGrupoComplementoRequest(UUID.randomUUID(), "Bebidas", "Escolha", 0, 2, 3);

        var grupo = complementoMapper.toEntity(request);

        assertThat(grupo.getLoja()).isNull();
        assertThat(grupo.getName()).isEqualTo("Bebidas");
        assertThat(grupo.getDescription()).isEqualTo("Escolha");
        assertThat(grupo.getMinQuantity()).isZero();
        assertThat(grupo.getMaxQuantity()).isEqualTo(2);
        assertThat(grupo.getSortOrder()).isEqualTo(3);
        assertThat(grupo.getActive()).isTrue();
    }

    @Test
    void deveConverterGrupoComplementoParaResponses() {
        var grupo = grupoComplemento();

        assertThat(complementoMapper.toCriarGrupoComplementoResponse(grupo).id()).isEqualTo(grupo.getId());
        assertThat(complementoMapper.toListarGrupoComplementoResponse(grupo).lojaId()).isEqualTo(grupo.getLoja().getId());
        assertThat(complementoMapper.toDetalharGrupoComplementoResponse(grupo).criadoEm()).isEqualTo(grupo.getCreatedAt());
        assertThat(complementoMapper.toAtualizarGrupoComplementoResponse(grupo).atualizadoEm()).isEqualTo(grupo.getUpdatedAt());
    }

    @Test
    void deveAtualizarGrupoComplementoComRequest() {
        var grupo = grupoComplemento();
        var request = new AtualizarGrupoComplementoRequest("Molhos", "Extras", 1, 3, 5, false);

        complementoMapper.toEntity(request, grupo);

        assertThat(grupo.getName()).isEqualTo("Molhos");
        assertThat(grupo.getDescription()).isEqualTo("Extras");
        assertThat(grupo.getMinQuantity()).isEqualTo(1);
        assertThat(grupo.getMaxQuantity()).isEqualTo(3);
        assertThat(grupo.getSortOrder()).isEqualTo(5);
        assertThat(grupo.getActive()).isFalse();
    }

    @Test
    void deveConverterCriarOpcaoComplementoRequestParaEntity() {
        var request = new CriarOpcaoComplementoRequest(
            UUID.randomUUID(),
            UUID.randomUUID(),
            "Coca",
            "Lata",
            BigDecimal.TEN,
            null
        );

        var opcao = complementoMapper.toEntity(request);

        assertThat(opcao.getLoja()).isNull();
        assertThat(opcao.getGrupoComplemento()).isNull();
        assertThat(opcao.getName()).isEqualTo("Coca");
        assertThat(opcao.getAdditionalPrice()).isEqualTo(BigDecimal.TEN);
        assertThat(opcao.getSortOrder()).isZero();
        assertThat(opcao.getActive()).isTrue();
    }

    @Test
    void deveConverterOpcaoComplementoParaResponses() {
        var opcao = opcaoComplemento();

        assertThat(complementoMapper.toCriarOpcaoComplementoResponse(opcao).id()).isEqualTo(opcao.getId());
        assertThat(complementoMapper.toListarOpcaoComplementoResponse(opcao).grupoComplementoId())
            .isEqualTo(opcao.getGrupoComplemento().getId());
        assertThat(complementoMapper.toDetalharOpcaoComplementoResponse(opcao).nome()).isEqualTo(opcao.getName());
        assertThat(complementoMapper.toAtualizarOpcaoComplementoResponse(opcao).precoAdicional())
            .isEqualTo(opcao.getAdditionalPrice());
    }

    @Test
    void deveAtualizarOpcaoComplementoComRequest() {
        var opcao = opcaoComplemento();
        var request = new AtualizarOpcaoComplementoRequest("Pepsi", "Zero", BigDecimal.ONE, 4, false);

        complementoMapper.toEntity(request, opcao);

        assertThat(opcao.getName()).isEqualTo("Pepsi");
        assertThat(opcao.getDescription()).isEqualTo("Zero");
        assertThat(opcao.getAdditionalPrice()).isEqualTo(BigDecimal.ONE);
        assertThat(opcao.getSortOrder()).isEqualTo(4);
        assertThat(opcao.getActive()).isFalse();
    }

    @Test
    void deveConverterVinculoProdutoGrupoComplemento() {
        var request = new VincularGrupoComplementoProdutoRequest(UUID.randomUUID(), 7);
        var entity = complementoMapper.toEntity(request);

        assertThat(entity.getSortOrder()).isEqualTo(7);
        assertThat(entity.getActive()).isTrue();

        var vinculo = produtoGrupoComplemento();
        assertThat(complementoMapper.toVincularGrupoComplementoProdutoResponse(vinculo).produtoId())
            .isEqualTo(vinculo.getProduto().getId());
        assertThat(complementoMapper.toListarGrupoComplementoProdutoResponse(vinculo).quantidadeMaxima())
            .isEqualTo(vinculo.getGrupoComplemento().getMaxQuantity());
    }

    private GrupoComplemento grupoComplemento() {
        var loja = new Loja();
        loja.setId(UUID.randomUUID());
        var grupo = new GrupoComplemento();
        grupo.setId(UUID.randomUUID());
        grupo.setLoja(loja);
        grupo.setName("Bebidas");
        grupo.setDescription("Escolha");
        grupo.setMinQuantity(0);
        grupo.setMaxQuantity(2);
        grupo.setSortOrder(1);
        grupo.setActive(true);
        grupo.setCreatedAt(OffsetDateTime.now().minusDays(1));
        grupo.setUpdatedAt(OffsetDateTime.now());
        return grupo;
    }

    private OpcaoComplemento opcaoComplemento() {
        var opcao = new OpcaoComplemento();
        opcao.setId(UUID.randomUUID());
        opcao.setLoja(grupoComplemento().getLoja());
        opcao.setGrupoComplemento(grupoComplemento());
        opcao.setName("Coca");
        opcao.setDescription("Lata");
        opcao.setAdditionalPrice(BigDecimal.TEN);
        opcao.setSortOrder(2);
        opcao.setActive(true);
        return opcao;
    }

    private ProdutoGrupoComplemento produtoGrupoComplemento() {
        var produto = new Produto();
        produto.setId(UUID.randomUUID());
        var vinculo = new ProdutoGrupoComplemento();
        vinculo.setId(UUID.randomUUID());
        vinculo.setProduto(produto);
        vinculo.setGrupoComplemento(grupoComplemento());
        vinculo.setSortOrder(1);
        vinculo.setActive(true);
        return vinculo;
    }
}
