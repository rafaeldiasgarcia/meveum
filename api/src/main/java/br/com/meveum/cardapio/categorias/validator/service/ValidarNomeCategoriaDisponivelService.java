package br.com.meveum.cardapio.categorias.validator.service;

import br.com.meveum.shared.exception.RegraNegocioException;
import br.com.meveum.cardapio.repository.CategoriaRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarNomeCategoriaDisponivelService {

    private final CategoriaRepository categoriaRepository;

    public void validarCriacao(UUID lojaId, String nome) {
        if (categoriaRepository.existsByLojaIdAndNameIgnoreCase(lojaId, nome)) {
            throw new RegraNegocioException("Ja existe uma categoria com esse nome.");
        }
    }

    public void validarAtualizacao(UUID lojaId, UUID categoriaId, String nome) {
        if (categoriaRepository.existsByLojaIdAndNameIgnoreCaseAndIdNot(lojaId, nome, categoriaId)) {
            throw new RegraNegocioException("Ja existe uma categoria com esse nome.");
        }
    }
}
