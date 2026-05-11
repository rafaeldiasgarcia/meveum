package br.com.meveum.cardapio.categorias.service;

import br.com.meveum.cardapio.categorias.dto.AtualizarCategoriaRequest;
import br.com.meveum.cardapio.categorias.dto.AtualizarCategoriaResponse;
import br.com.meveum.cardapio.categorias.mapper.CategoriaMapper;
import br.com.meveum.cardapio.repository.CategoriaRepository;
import br.com.meveum.cardapio.categorias.validator.CategoriaValidator;
import br.com.meveum.cardapio.categorias.validator.service.ValidarCategoriaExisteService;
import br.com.meveum.cardapio.categorias.validator.service.ValidarNomeCategoriaDisponivelService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AtualizarCategoriaService {

    private final CategoriaValidator categoriaValidator;
    private final ValidarCategoriaExisteService validarCategoriaExisteService;
    private final ValidarNomeCategoriaDisponivelService validarNomeCategoriaDisponivelService;
    private final CategoriaRepository categoriaRepository;
    private final CategoriaMapper categoriaMapper;

    public AtualizarCategoriaResponse atualizar(UUID categoriaId, AtualizarCategoriaRequest request) {
        categoriaValidator.validarAtualizacao(request);
        var categoria = validarCategoriaExisteService.validar(categoriaId);
        validarNomeCategoriaDisponivelService.validarAtualizacao(
            categoria.getLoja().getId(),
            categoriaId,
            request.nome()
        );
        categoriaMapper.toEntity(request, categoria);
        var categoriaSalva = categoriaRepository.save(categoria);
        return categoriaMapper.toAtualizarCategoriaResponse(categoriaSalva);
    }
}
