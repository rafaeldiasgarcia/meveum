package br.com.meveum.validators.categorias.services;

import br.com.meveum.entities.Categoria;
import br.com.meveum.exceptions.RecursoNaoEncontradoException;
import br.com.meveum.repositories.CategoriaRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarCategoriaExisteService {

    private final CategoriaRepository categoriaRepository;

    public Categoria validar(UUID categoriaId) {
        return categoriaRepository.findById(categoriaId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria nao encontrada."));
    }

    public Categoria validar(UUID categoriaId, UUID lojaId) {
        return categoriaRepository.findByIdAndLojaId(categoriaId, lojaId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria nao encontrada."));
    }
}
