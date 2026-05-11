package br.com.meveum.cardapio.complementos.service;

import br.com.meveum.cardapio.complementos.dto.DetalharOpcaoComplementoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.complementos.validator.service.ValidarOpcaoComplementoExisteService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DetalharOpcaoComplementoService {

    private final ValidarOpcaoComplementoExisteService validarOpcaoComplementoExisteService;
    private final ComplementoMapper complementoMapper;

    public DetalharOpcaoComplementoResponse detalhar(UUID opcaoComplementoId) {
        var opcaoComplemento = validarOpcaoComplementoExisteService.validar(opcaoComplementoId);
        return complementoMapper.toDetalharOpcaoComplementoResponse(opcaoComplemento);
    }
}
