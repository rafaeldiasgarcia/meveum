package br.com.meveum.cardapio.categorias.mapper;

import br.com.meveum.cardapio.categorias.dto.AtualizarCategoriaRequest;
import br.com.meveum.cardapio.categorias.dto.AtualizarCategoriaResponse;
import br.com.meveum.cardapio.categorias.dto.CriarCategoriaRequest;
import br.com.meveum.cardapio.categorias.dto.CriarCategoriaResponse;
import br.com.meveum.cardapio.categorias.dto.DetalharCategoriaResponse;
import br.com.meveum.cardapio.categorias.dto.ListarCategoriaResponse;
import br.com.meveum.cardapio.entity.Categoria;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper {

    public Categoria toEntity(CriarCategoriaRequest request) {
        return Categoria.builder()
            .name(request.nome())
            .description(request.descricao())
            .sortOrder(request.ordem() == null ? 0 : request.ordem())
            .active(true)
            .build();
    }

    public CriarCategoriaResponse toCriarCategoriaResponse(Categoria categoria) {
        return CriarCategoriaResponse.builder()
            .id(categoria.getId())
            .lojaId(categoria.getLoja().getId())
            .nome(categoria.getName())
            .descricao(categoria.getDescription())
            .ordem(categoria.getSortOrder())
            .ativo(categoria.getActive())
            .criadoEm(categoria.getCreatedAt())
            .atualizadoEm(categoria.getUpdatedAt())
            .build();
    }

    public ListarCategoriaResponse toListarCategoriaResponse(Categoria categoria) {
        return ListarCategoriaResponse.builder()
            .id(categoria.getId())
            .lojaId(categoria.getLoja().getId())
            .nome(categoria.getName())
            .descricao(categoria.getDescription())
            .ordem(categoria.getSortOrder())
            .ativo(categoria.getActive())
            .build();
    }

    public DetalharCategoriaResponse toDetalharCategoriaResponse(Categoria categoria) {
        return DetalharCategoriaResponse.builder()
            .id(categoria.getId())
            .lojaId(categoria.getLoja().getId())
            .nome(categoria.getName())
            .descricao(categoria.getDescription())
            .ordem(categoria.getSortOrder())
            .ativo(categoria.getActive())
            .criadoEm(categoria.getCreatedAt())
            .atualizadoEm(categoria.getUpdatedAt())
            .build();
    }

    public AtualizarCategoriaResponse toAtualizarCategoriaResponse(Categoria categoria) {
        return AtualizarCategoriaResponse.builder()
            .id(categoria.getId())
            .lojaId(categoria.getLoja().getId())
            .nome(categoria.getName())
            .descricao(categoria.getDescription())
            .ordem(categoria.getSortOrder())
            .ativo(categoria.getActive())
            .criadoEm(categoria.getCreatedAt())
            .atualizadoEm(categoria.getUpdatedAt())
            .build();
    }

    public void toEntity(AtualizarCategoriaRequest request, Categoria categoria) {
        categoria.setName(request.nome());

        if (request.descricao() != null) {
            categoria.setDescription(request.descricao());
        }

        if (request.ordem() != null) {
            categoria.setSortOrder(request.ordem());
        }

        if (request.ativo() != null) {
            categoria.setActive(request.ativo());
        }
    }
}
