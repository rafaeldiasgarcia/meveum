package br.com.meveum.cardapio.categorias.service;

import br.com.meveum.cardapio.categorias.dto.ListarCategoriaResponse;
import br.com.meveum.cardapio.categorias.mapper.CategoriaMapper;
import br.com.meveum.cardapio.repository.CategoriaRepository;
import br.com.meveum.cardapio.categorias.validator.service.ValidarLojaCategoriaExisteService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListarCategoriaService {

    private final ValidarLojaCategoriaExisteService validarLojaCategoriaExisteService;
    private final CategoriaRepository categoriaRepository;
    private final CategoriaMapper categoriaMapper;

    public List<ListarCategoriaResponse> listar(UUID lojaId) {
        validarLojaCategoriaExisteService.validar(lojaId);
        return categoriaRepository.findByLojaIdOrderBySortOrderAsc(lojaId)
            .stream()
            .map(categoriaMapper::toListarCategoriaResponse)
            .toList();
    }
}
