package br.com.meveum.services.categorias;

import br.com.meveum.repositories.CategoriaRepository;
import br.com.meveum.validators.categorias.services.ValidarCategoriaExisteService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExcluirCategoriaService {

    private final ValidarCategoriaExisteService validarCategoriaExisteService;
    private final CategoriaRepository categoriaRepository;

    public void excluir(UUID categoriaId) {
        var categoria = validarCategoriaExisteService.validar(categoriaId);
        categoria.setActive(false);
        categoriaRepository.save(categoria);
    }
}
