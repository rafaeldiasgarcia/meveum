package br.com.meveum.cardapio.complementos.service;

import br.com.meveum.cardapio.complementos.validator.service.ValidarOpcaoComplementoExisteService;
import br.com.meveum.cardapio.repository.OpcaoComplementoRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExcluirOpcaoComplementoService {

    private final ValidarOpcaoComplementoExisteService validarOpcaoComplementoExisteService;
    private final OpcaoComplementoRepository opcaoComplementoRepository;

    public void excluir(UUID opcaoComplementoId) {
        var opcaoComplemento = validarOpcaoComplementoExisteService.validar(opcaoComplementoId);
        opcaoComplemento.setActive(false);
        opcaoComplementoRepository.save(opcaoComplemento);
    }
}
