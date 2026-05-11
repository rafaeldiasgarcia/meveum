package br.com.meveum.lojas.validator.service;

import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.repository.LojaRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarLojaExisteService {

    private final LojaRepository lojaRepository;

    public Loja validar(UUID lojaId) {
        return lojaRepository.findById(lojaId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Loja nao encontrada."));
    }

    public Loja validarPorSlug(String slug) {
        return lojaRepository.findBySlug(slug)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Loja nao encontrada."));
    }
}
