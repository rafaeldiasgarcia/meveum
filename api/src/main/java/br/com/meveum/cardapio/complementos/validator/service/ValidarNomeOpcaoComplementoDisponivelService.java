package br.com.meveum.cardapio.complementos.validator.service;

import br.com.meveum.cardapio.repository.OpcaoComplementoRepository;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarNomeOpcaoComplementoDisponivelService {

    private final OpcaoComplementoRepository opcaoComplementoRepository;

    public void validarCriacao(UUID grupoComplementoId, String nome) {
        if (opcaoComplementoRepository.existsByGrupoComplementoIdAndNameIgnoreCase(grupoComplementoId, nome)) {
            throw new RegraNegocioException("Ja existe uma opcao de complemento com esse nome.");
        }
    }

    public void validarAtualizacao(UUID grupoComplementoId, UUID opcaoComplementoId, String nome) {
        if (opcaoComplementoRepository.existsByGrupoComplementoIdAndNameIgnoreCaseAndIdNot(
            grupoComplementoId,
            nome,
            opcaoComplementoId
        )) {
            throw new RegraNegocioException("Ja existe uma opcao de complemento com esse nome.");
        }
    }
}
