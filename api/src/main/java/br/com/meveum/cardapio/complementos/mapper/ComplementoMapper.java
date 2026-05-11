package br.com.meveum.cardapio.complementos.mapper;

import br.com.meveum.cardapio.complementos.dto.AtualizarGrupoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.AtualizarGrupoComplementoResponse;
import br.com.meveum.cardapio.complementos.dto.AtualizarOpcaoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.AtualizarOpcaoComplementoResponse;
import br.com.meveum.cardapio.complementos.dto.CriarGrupoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.CriarGrupoComplementoResponse;
import br.com.meveum.cardapio.complementos.dto.CriarOpcaoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.CriarOpcaoComplementoResponse;
import br.com.meveum.cardapio.complementos.dto.DetalharGrupoComplementoResponse;
import br.com.meveum.cardapio.complementos.dto.DetalharOpcaoComplementoResponse;
import br.com.meveum.cardapio.complementos.dto.ListarGrupoComplementoProdutoResponse;
import br.com.meveum.cardapio.complementos.dto.ListarGrupoComplementoResponse;
import br.com.meveum.cardapio.complementos.dto.ListarOpcaoComplementoResponse;
import br.com.meveum.cardapio.complementos.dto.VincularGrupoComplementoProdutoRequest;
import br.com.meveum.cardapio.complementos.dto.VincularGrupoComplementoProdutoResponse;
import br.com.meveum.cardapio.entity.GrupoComplemento;
import br.com.meveum.cardapio.entity.OpcaoComplemento;
import br.com.meveum.cardapio.entity.ProdutoGrupoComplemento;
import org.springframework.stereotype.Component;

@Component
public class ComplementoMapper {

    public GrupoComplemento toEntity(CriarGrupoComplementoRequest request) {
        return GrupoComplemento.builder()
            .name(request.nome())
            .description(request.descricao())
            .minQuantity(request.quantidadeMinima())
            .maxQuantity(request.quantidadeMaxima())
            .sortOrder(request.ordem() == null ? 0 : request.ordem())
            .active(true)
            .build();
    }

    public CriarGrupoComplementoResponse toCriarGrupoComplementoResponse(GrupoComplemento grupoComplemento) {
        return CriarGrupoComplementoResponse.builder()
            .id(grupoComplemento.getId())
            .lojaId(grupoComplemento.getLoja().getId())
            .nome(grupoComplemento.getName())
            .descricao(grupoComplemento.getDescription())
            .quantidadeMinima(grupoComplemento.getMinQuantity())
            .quantidadeMaxima(grupoComplemento.getMaxQuantity())
            .ordem(grupoComplemento.getSortOrder())
            .ativo(grupoComplemento.getActive())
            .criadoEm(grupoComplemento.getCreatedAt())
            .atualizadoEm(grupoComplemento.getUpdatedAt())
            .build();
    }

    public ListarGrupoComplementoResponse toListarGrupoComplementoResponse(GrupoComplemento grupoComplemento) {
        return ListarGrupoComplementoResponse.builder()
            .id(grupoComplemento.getId())
            .lojaId(grupoComplemento.getLoja().getId())
            .nome(grupoComplemento.getName())
            .descricao(grupoComplemento.getDescription())
            .quantidadeMinima(grupoComplemento.getMinQuantity())
            .quantidadeMaxima(grupoComplemento.getMaxQuantity())
            .ordem(grupoComplemento.getSortOrder())
            .ativo(grupoComplemento.getActive())
            .build();
    }

    public DetalharGrupoComplementoResponse toDetalharGrupoComplementoResponse(GrupoComplemento grupoComplemento) {
        return DetalharGrupoComplementoResponse.builder()
            .id(grupoComplemento.getId())
            .lojaId(grupoComplemento.getLoja().getId())
            .nome(grupoComplemento.getName())
            .descricao(grupoComplemento.getDescription())
            .quantidadeMinima(grupoComplemento.getMinQuantity())
            .quantidadeMaxima(grupoComplemento.getMaxQuantity())
            .ordem(grupoComplemento.getSortOrder())
            .ativo(grupoComplemento.getActive())
            .criadoEm(grupoComplemento.getCreatedAt())
            .atualizadoEm(grupoComplemento.getUpdatedAt())
            .build();
    }

    public AtualizarGrupoComplementoResponse toAtualizarGrupoComplementoResponse(GrupoComplemento grupoComplemento) {
        return AtualizarGrupoComplementoResponse.builder()
            .id(grupoComplemento.getId())
            .lojaId(grupoComplemento.getLoja().getId())
            .nome(grupoComplemento.getName())
            .descricao(grupoComplemento.getDescription())
            .quantidadeMinima(grupoComplemento.getMinQuantity())
            .quantidadeMaxima(grupoComplemento.getMaxQuantity())
            .ordem(grupoComplemento.getSortOrder())
            .ativo(grupoComplemento.getActive())
            .criadoEm(grupoComplemento.getCreatedAt())
            .atualizadoEm(grupoComplemento.getUpdatedAt())
            .build();
    }

    public void toEntity(AtualizarGrupoComplementoRequest request, GrupoComplemento grupoComplemento) {
        grupoComplemento.setName(request.nome());
        grupoComplemento.setMinQuantity(request.quantidadeMinima());
        grupoComplemento.setMaxQuantity(request.quantidadeMaxima());

        if (request.descricao() != null) {
            grupoComplemento.setDescription(request.descricao());
        }

        if (request.ordem() != null) {
            grupoComplemento.setSortOrder(request.ordem());
        }

        if (request.ativo() != null) {
            grupoComplemento.setActive(request.ativo());
        }
    }

    public OpcaoComplemento toEntity(CriarOpcaoComplementoRequest request) {
        return OpcaoComplemento.builder()
            .name(request.nome())
            .description(request.descricao())
            .additionalPrice(request.precoAdicional())
            .sortOrder(request.ordem() == null ? 0 : request.ordem())
            .active(true)
            .build();
    }

    public CriarOpcaoComplementoResponse toCriarOpcaoComplementoResponse(OpcaoComplemento opcaoComplemento) {
        return CriarOpcaoComplementoResponse.builder()
            .id(opcaoComplemento.getId())
            .lojaId(opcaoComplemento.getLoja().getId())
            .grupoComplementoId(opcaoComplemento.getGrupoComplemento().getId())
            .nome(opcaoComplemento.getName())
            .descricao(opcaoComplemento.getDescription())
            .precoAdicional(opcaoComplemento.getAdditionalPrice())
            .ordem(opcaoComplemento.getSortOrder())
            .ativo(opcaoComplemento.getActive())
            .build();
    }

    public ListarOpcaoComplementoResponse toListarOpcaoComplementoResponse(OpcaoComplemento opcaoComplemento) {
        return ListarOpcaoComplementoResponse.builder()
            .id(opcaoComplemento.getId())
            .lojaId(opcaoComplemento.getLoja().getId())
            .grupoComplementoId(opcaoComplemento.getGrupoComplemento().getId())
            .nome(opcaoComplemento.getName())
            .descricao(opcaoComplemento.getDescription())
            .precoAdicional(opcaoComplemento.getAdditionalPrice())
            .ordem(opcaoComplemento.getSortOrder())
            .ativo(opcaoComplemento.getActive())
            .build();
    }

    public DetalharOpcaoComplementoResponse toDetalharOpcaoComplementoResponse(OpcaoComplemento opcaoComplemento) {
        return DetalharOpcaoComplementoResponse.builder()
            .id(opcaoComplemento.getId())
            .lojaId(opcaoComplemento.getLoja().getId())
            .grupoComplementoId(opcaoComplemento.getGrupoComplemento().getId())
            .nome(opcaoComplemento.getName())
            .descricao(opcaoComplemento.getDescription())
            .precoAdicional(opcaoComplemento.getAdditionalPrice())
            .ordem(opcaoComplemento.getSortOrder())
            .ativo(opcaoComplemento.getActive())
            .build();
    }

    public AtualizarOpcaoComplementoResponse toAtualizarOpcaoComplementoResponse(OpcaoComplemento opcaoComplemento) {
        return AtualizarOpcaoComplementoResponse.builder()
            .id(opcaoComplemento.getId())
            .lojaId(opcaoComplemento.getLoja().getId())
            .grupoComplementoId(opcaoComplemento.getGrupoComplemento().getId())
            .nome(opcaoComplemento.getName())
            .descricao(opcaoComplemento.getDescription())
            .precoAdicional(opcaoComplemento.getAdditionalPrice())
            .ordem(opcaoComplemento.getSortOrder())
            .ativo(opcaoComplemento.getActive())
            .build();
    }

    public void toEntity(AtualizarOpcaoComplementoRequest request, OpcaoComplemento opcaoComplemento) {
        opcaoComplemento.setName(request.nome());
        opcaoComplemento.setAdditionalPrice(request.precoAdicional());

        if (request.descricao() != null) {
            opcaoComplemento.setDescription(request.descricao());
        }

        if (request.ordem() != null) {
            opcaoComplemento.setSortOrder(request.ordem());
        }

        if (request.ativo() != null) {
            opcaoComplemento.setActive(request.ativo());
        }
    }

    public ProdutoGrupoComplemento toEntity(VincularGrupoComplementoProdutoRequest request) {
        return ProdutoGrupoComplemento.builder()
            .sortOrder(request.ordem() == null ? 0 : request.ordem())
            .active(true)
            .build();
    }

    public VincularGrupoComplementoProdutoResponse toVincularGrupoComplementoProdutoResponse(
        ProdutoGrupoComplemento produtoGrupoComplemento
    ) {
        return VincularGrupoComplementoProdutoResponse.builder()
            .id(produtoGrupoComplemento.getId())
            .produtoId(produtoGrupoComplemento.getProduto().getId())
            .grupoComplementoId(produtoGrupoComplemento.getGrupoComplemento().getId())
            .nomeGrupoComplemento(produtoGrupoComplemento.getGrupoComplemento().getName())
            .ordem(produtoGrupoComplemento.getSortOrder())
            .ativo(produtoGrupoComplemento.getActive())
            .build();
    }

    public ListarGrupoComplementoProdutoResponse toListarGrupoComplementoProdutoResponse(
        ProdutoGrupoComplemento produtoGrupoComplemento
    ) {
        var grupoComplemento = produtoGrupoComplemento.getGrupoComplemento();
        return ListarGrupoComplementoProdutoResponse.builder()
            .id(produtoGrupoComplemento.getId())
            .produtoId(produtoGrupoComplemento.getProduto().getId())
            .grupoComplementoId(grupoComplemento.getId())
            .nomeGrupoComplemento(grupoComplemento.getName())
            .quantidadeMinima(grupoComplemento.getMinQuantity())
            .quantidadeMaxima(grupoComplemento.getMaxQuantity())
            .ordem(produtoGrupoComplemento.getSortOrder())
            .ativo(produtoGrupoComplemento.getActive())
            .build();
    }
}
