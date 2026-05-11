package br.com.meveum.services.categorias;

import br.com.meveum.dtos.categorias.DetalharCategoriaResponse;
import br.com.meveum.mappers.CategoriaMapper;
import br.com.meveum.validators.categorias.services.ValidarCategoriaExisteService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DetalharCategoriaService {

    private final ValidarCategoriaExisteService validarCategoriaExisteService;
    private final CategoriaMapper categoriaMapper;

    public DetalharCategoriaResponse detalhar(UUID categoriaId) {
        var categoria = validarCategoriaExisteService.validar(categoriaId);
        return categoriaMapper.toDetalharCategoriaResponse(categoria);
    }
}
