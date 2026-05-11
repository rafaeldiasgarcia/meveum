package br.com.meveum.cardapio.complementos.validator.service;

import br.com.meveum.cardapio.repository.GrupoComplementoRepository;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarNomeGrupoComplementoDisponivelService {

    private final GrupoComplementoRepository grupoComplementoRepository;

    public void validarCriacao(UUID lojaId, String nome) {
        if (grupoComplementoRepository.existsByLojaIdAndNameIgnoreCase(lojaId, nome)) {
            throw new RegraNegocioException("Ja existe um grupo de complemento com esse nome.");
        }
    }

    public void validarAtualizacao(UUID lojaId, UUID grupoComplementoId, String nome) {
        if (grupoComplementoRepository.existsByLojaIdAndNameIgnoreCaseAndIdNot(lojaId, nome, grupoComplementoId)) {
            throw new RegraNegocioException("Ja existe um grupo de complemento com esse nome.");
        }
    }
}
