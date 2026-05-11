package br.com.meveum.services.categorias;

import br.com.meveum.dtos.categorias.ListarCategoriaResponse;
import br.com.meveum.mappers.CategoriaMapper;
import br.com.meveum.repositories.CategoriaRepository;
import br.com.meveum.validators.categorias.services.ValidarLojaCategoriaExisteService;
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
