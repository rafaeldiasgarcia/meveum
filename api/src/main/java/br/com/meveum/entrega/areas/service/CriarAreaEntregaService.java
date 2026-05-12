package br.com.meveum.entrega.areas.service;

import br.com.meveum.entrega.areas.dto.CriarAreaEntregaRequest;
import br.com.meveum.entrega.areas.dto.CriarAreaEntregaResponse;
import br.com.meveum.entrega.areas.mapper.AreaEntregaMapper;
import br.com.meveum.entrega.areas.validator.AreaEntregaValidator;
import br.com.meveum.entrega.repository.AreaEntregaLojaRepository;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CriarAreaEntregaService {

    private final AreaEntregaValidator areaEntregaValidator;
    private final ValidarLojaExisteService validarLojaExisteService;
    private final AreaEntregaLojaRepository areaEntregaLojaRepository;
    private final AreaEntregaMapper areaEntregaMapper;

    public CriarAreaEntregaResponse criar(CriarAreaEntregaRequest request) {
        areaEntregaValidator.validarCriacao(request);
        var loja = validarLojaExisteService.validar(request.lojaId());
        var areaEntrega = areaEntregaMapper.toEntity(request);
        areaEntrega.setLoja(loja);
        var areaEntregaSalva = areaEntregaLojaRepository.save(areaEntrega);
        return areaEntregaMapper.toCriarAreaEntregaResponse(areaEntregaSalva);
    }
}
