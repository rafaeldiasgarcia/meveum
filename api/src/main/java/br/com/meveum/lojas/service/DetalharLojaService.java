package br.com.meveum.lojas.service;

import br.com.meveum.lojas.dto.DetalharLojaResponse;
import br.com.meveum.lojas.mapper.LojaMapper;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DetalharLojaService {

    private final ValidarLojaExisteService validarLojaExisteService;
    private final LojaMapper lojaMapper;

    public DetalharLojaResponse detalhar(UUID lojaId) {
        var loja = validarLojaExisteService.validar(lojaId);
        return lojaMapper.toDetalharLojaResponse(loja);
    }
}
