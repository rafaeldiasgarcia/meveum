package br.com.meveum.services.categorias;

import br.com.meveum.dtos.categorias.AtualizarCategoriaRequest;
import br.com.meveum.dtos.categorias.AtualizarCategoriaResponse;
import br.com.meveum.mappers.CategoriaMapper;
import br.com.meveum.repositories.CategoriaRepository;
import br.com.meveum.validators.categorias.CategoriaValidator;
import br.com.meveum.validators.categorias.services.ValidarCategoriaExisteService;
import br.com.meveum.validators.categorias.services.ValidarNomeCategoriaDisponivelService;
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
