package br.com.meveum.cardapio.categorias.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.categorias.dto.CriarCategoriaRequest;
import br.com.meveum.cardapio.categorias.dto.CriarCategoriaResponse;
import br.com.meveum.cardapio.categorias.mapper.CategoriaMapper;
import br.com.meveum.cardapio.repository.CategoriaRepository;
import br.com.meveum.cardapio.categorias.validator.CategoriaValidator;
import br.com.meveum.cardapio.categorias.validator.service.ValidarLojaCategoriaExisteService;
import br.com.meveum.cardapio.categorias.validator.service.ValidarNomeCategoriaDisponivelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CriarCategoriaService {

    private final CategoriaValidator categoriaValidator;
    private final ValidarLojaCategoriaExisteService validarLojaCategoriaExisteService;
    private final ValidarNomeCategoriaDisponivelService validarNomeCategoriaDisponivelService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final CategoriaRepository categoriaRepository;
    private final CategoriaMapper categoriaMapper;

    public CriarCategoriaResponse criar(CriarCategoriaRequest request) {
        categoriaValidator.validarCriacao(request);
        var loja = validarLojaCategoriaExisteService.validar(request.lojaId());
        validarAcessoLojaService.validar(loja.getId());
        validarNomeCategoriaDisponivelService.validarCriacao(request.lojaId(), request.nome());
        var categoria = categoriaMapper.toEntity(request);
        categoria.setLoja(loja);
        var categoriaSalva = categoriaRepository.save(categoria);
        return categoriaMapper.toCriarCategoriaResponse(categoriaSalva);
    }
}
