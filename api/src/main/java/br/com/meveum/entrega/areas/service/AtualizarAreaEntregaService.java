package br.com.meveum.entrega.areas.service;

import br.com.meveum.entrega.areas.dto.AtualizarAreaEntregaRequest;
import br.com.meveum.entrega.areas.dto.AtualizarAreaEntregaResponse;
import br.com.meveum.entrega.areas.mapper.AreaEntregaMapper;
import br.com.meveum.entrega.areas.validator.AreaEntregaValidator;
import br.com.meveum.entrega.areas.validator.service.ValidarAreaEntregaExisteService;
import br.com.meveum.entrega.repository.AreaEntregaLojaRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AtualizarAreaEntregaService {

    private final AreaEntregaValidator areaEntregaValidator;
    private final ValidarAreaEntregaExisteService validarAreaEntregaExisteService;
    private final AreaEntregaLojaRepository areaEntregaLojaRepository;
    private final AreaEntregaMapper areaEntregaMapper;

    public AtualizarAreaEntregaResponse atualizar(UUID areaEntregaId, AtualizarAreaEntregaRequest request) {
        areaEntregaValidator.validarAtualizacao(request);
        var areaEntrega = validarAreaEntregaExisteService.validar(areaEntregaId);
        areaEntregaMapper.toEntity(request, areaEntrega);
        var areaEntregaSalva = areaEntregaLojaRepository.save(areaEntrega);
        return areaEntregaMapper.toAtualizarAreaEntregaResponse(areaEntregaSalva);
    }
}
