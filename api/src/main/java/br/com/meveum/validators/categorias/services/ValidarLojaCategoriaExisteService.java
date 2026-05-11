package br.com.meveum.validators.categorias.services;

import br.com.meveum.entities.Loja;
import br.com.meveum.exceptions.RecursoNaoEncontradoException;
import br.com.meveum.repositories.LojaRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarLojaCategoriaExisteService {

    private final LojaRepository lojaRepository;

    public Loja validar(UUID lojaId) {
        return lojaRepository.findById(lojaId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Loja nao encontrada."));
    }
}
