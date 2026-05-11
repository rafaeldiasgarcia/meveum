package br.com.meveum.services.categorias;

import br.com.meveum.dtos.categorias.CriarCategoriaRequest;
import br.com.meveum.dtos.categorias.CriarCategoriaResponse;
import br.com.meveum.mappers.CategoriaMapper;
import br.com.meveum.repositories.CategoriaRepository;
import br.com.meveum.validators.categorias.CategoriaValidator;
import br.com.meveum.validators.categorias.services.ValidarLojaCategoriaExisteService;
import br.com.meveum.validators.categorias.services.ValidarNomeCategoriaDisponivelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CriarCategoriaService {

    private final CategoriaValidator categoriaValidator;
    private final ValidarLojaCategoriaExisteService validarLojaCategoriaExisteService;
    private final ValidarNomeCategoriaDisponivelService validarNomeCategoriaDisponivelService;
    private final CategoriaRepository categoriaRepository;
    private final CategoriaMapper categoriaMapper;

    public CriarCategoriaResponse criar(CriarCategoriaRequest request) {
        categoriaValidator.validarCriacao(request);
        var loja = validarLojaCategoriaExisteService.validar(request.lojaId());
        validarNomeCategoriaDisponivelService.validarCriacao(request.lojaId(), request.nome());
        var categoria = categoriaMapper.toEntity(request);
        categoria.setLoja(loja);
        var categoriaSalva = categoriaRepository.save(categoria);
        return categoriaMapper.toCriarCategoriaResponse(categoriaSalva);
    }
}
