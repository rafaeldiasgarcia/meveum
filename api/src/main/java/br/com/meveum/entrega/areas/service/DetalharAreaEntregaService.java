package br.com.meveum.entrega.areas.service;

import br.com.meveum.entrega.areas.dto.DetalharAreaEntregaResponse;
import br.com.meveum.entrega.areas.mapper.AreaEntregaMapper;
import br.com.meveum.entrega.areas.validator.service.ValidarAreaEntregaExisteService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DetalharAreaEntregaService {

    private final ValidarAreaEntregaExisteService validarAreaEntregaExisteService;
    private final AreaEntregaMapper areaEntregaMapper;

    public DetalharAreaEntregaResponse detalhar(UUID areaEntregaId) {
        var areaEntrega = validarAreaEntregaExisteService.validar(areaEntregaId);
        return areaEntregaMapper.toDetalharAreaEntregaResponse(areaEntrega);
    }
}
