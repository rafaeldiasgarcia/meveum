package br.com.meveum.cardapio.complementos.validator.service;

import br.com.meveum.cardapio.entity.GrupoComplemento;
import br.com.meveum.cardapio.repository.GrupoComplementoRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarGrupoComplementoExisteService {

    private final GrupoComplementoRepository grupoComplementoRepository;

    public GrupoComplemento validar(UUID grupoComplementoId) {
        return grupoComplementoRepository.findById(grupoComplementoId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Grupo de complemento nao encontrado."));
    }

    public GrupoComplemento validar(UUID grupoComplementoId, UUID lojaId) {
        return grupoComplementoRepository.findByIdAndLojaId(grupoComplementoId, lojaId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Grupo de complemento nao encontrado."));
    }

    public GrupoComplemento validarAtivo(UUID grupoComplementoId, UUID lojaId) {
        var grupoComplemento = validar(grupoComplementoId, lojaId);

        if (!grupoComplemento.getActive()) {
            throw new RegraNegocioException("Grupo de complemento precisa estar ativo.");
        }

        return grupoComplemento;
    }
}
