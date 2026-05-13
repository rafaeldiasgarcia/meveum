package br.com.meveum.lojas.validator.service;

import br.com.meveum.lojas.repository.LojaRepository;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarSlugLojaDisponivelService {

    private final LojaRepository lojaRepository;

    public void validarAtualizacao(UUID lojaId, String slug) {
        if (lojaRepository.existsBySlugAndIdNot(slug, lojaId)) {
            throw new RegraNegocioException("Ja existe uma loja com esse slug.");
        }
    }

    public void validar(String slug) {
        if (lojaRepository.existsBySlug(slug)) {
            throw new RegraNegocioException("Ja existe uma loja com esse slug.");
        }
    }
}
