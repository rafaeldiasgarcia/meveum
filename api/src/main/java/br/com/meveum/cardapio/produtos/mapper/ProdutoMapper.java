package br.com.meveum.cardapio.produtos.mapper;

import br.com.meveum.cardapio.entity.Produto;
import br.com.meveum.cardapio.produtos.dto.AtualizarProdutoRequest;
import br.com.meveum.cardapio.produtos.dto.AtualizarProdutoResponse;
import br.com.meveum.cardapio.produtos.dto.CriarProdutoRequest;
import br.com.meveum.cardapio.produtos.dto.CriarProdutoResponse;
import br.com.meveum.cardapio.produtos.dto.DetalharProdutoResponse;
import br.com.meveum.cardapio.produtos.dto.ListarProdutoResponse;
import org.springframework.stereotype.Component;

@Component
public class ProdutoMapper {

    public Produto toEntity(CriarProdutoRequest request) {
        return Produto.builder()
            .name(request.nome())
            .description(request.descricao())
            .basePrice(request.preco())
            .imageUrl(request.imagemUrl())
            .sortOrder(request.ordem() == null ? 0 : request.ordem())
            .active(true)
            .available(true)
            .build();
    }

    public CriarProdutoResponse toCriarProdutoResponse(Produto produto) {
        return CriarProdutoResponse.builder()
            .id(produto.getId())
            .lojaId(produto.getLoja().getId())
            .categoriaId(produto.getCategoria().getId())
            .nome(produto.getName())
            .descricao(produto.getDescription())
            .preco(produto.getBasePrice())
            .imagemUrl(produto.getImageUrl())
            .ordem(produto.getSortOrder())
            .ativo(produto.getActive())
            .disponivel(produto.getAvailable())
            .criadoEm(produto.getCreatedAt())
            .atualizadoEm(produto.getUpdatedAt())
            .build();
    }

    public ListarProdutoResponse toListarProdutoResponse(Produto produto) {
        return ListarProdutoResponse.builder()
            .id(produto.getId())
            .lojaId(produto.getLoja().getId())
            .categoriaId(produto.getCategoria().getId())
            .nome(produto.getName())
            .descricao(produto.getDescription())
            .preco(produto.getBasePrice())
            .imagemUrl(produto.getImageUrl())
            .ordem(produto.getSortOrder())
            .ativo(produto.getActive())
            .disponivel(produto.getAvailable())
            .build();
    }

    public DetalharProdutoResponse toDetalharProdutoResponse(Produto produto) {
        return DetalharProdutoResponse.builder()
            .id(produto.getId())
            .lojaId(produto.getLoja().getId())
            .categoriaId(produto.getCategoria().getId())
            .nome(produto.getName())
            .descricao(produto.getDescription())
            .preco(produto.getBasePrice())
            .imagemUrl(produto.getImageUrl())
            .ordem(produto.getSortOrder())
            .ativo(produto.getActive())
            .disponivel(produto.getAvailable())
            .criadoEm(produto.getCreatedAt())
            .atualizadoEm(produto.getUpdatedAt())
            .build();
    }

    public AtualizarProdutoResponse toAtualizarProdutoResponse(Produto produto) {
        return AtualizarProdutoResponse.builder()
            .id(produto.getId())
            .lojaId(produto.getLoja().getId())
            .categoriaId(produto.getCategoria().getId())
            .nome(produto.getName())
            .descricao(produto.getDescription())
            .preco(produto.getBasePrice())
            .imagemUrl(produto.getImageUrl())
            .ordem(produto.getSortOrder())
            .ativo(produto.getActive())
            .disponivel(produto.getAvailable())
            .criadoEm(produto.getCreatedAt())
            .atualizadoEm(produto.getUpdatedAt())
            .build();
    }

    public void toEntity(AtualizarProdutoRequest request, Produto produto) {
        produto.setName(request.nome());
        produto.setBasePrice(request.preco());

        if (request.descricao() != null) {
            produto.setDescription(request.descricao());
        }

        if (request.imagemUrl() != null) {
            produto.setImageUrl(request.imagemUrl());
        }

        if (request.ordem() != null) {
            produto.setSortOrder(request.ordem());
        }

        if (request.ativo() != null) {
            produto.setActive(request.ativo());
        }
    }
}
