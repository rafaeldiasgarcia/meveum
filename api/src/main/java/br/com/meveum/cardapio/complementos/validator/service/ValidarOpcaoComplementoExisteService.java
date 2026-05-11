package br.com.meveum.cardapio.complementos.validator.service;

import br.com.meveum.cardapio.entity.OpcaoComplemento;
import br.com.meveum.cardapio.repository.OpcaoComplementoRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarOpcaoComplementoExisteService {

    private final OpcaoComplementoRepository opcaoComplementoRepository;

    public OpcaoComplemento validar(UUID opcaoComplementoId) {
        return opcaoComplementoRepository.findById(opcaoComplementoId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Opcao de complemento nao encontrada."));
    }

    public OpcaoComplemento validar(UUID opcaoComplementoId, UUID lojaId) {
        return opcaoComplementoRepository.findByIdAndLojaId(opcaoComplementoId, lojaId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Opcao de complemento nao encontrada."));
    }
}
