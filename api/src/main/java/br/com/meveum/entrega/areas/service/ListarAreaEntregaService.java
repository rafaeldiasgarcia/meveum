package br.com.meveum.entrega.areas.service;

import br.com.meveum.entrega.areas.dto.ListarAreaEntregaResponse;
import br.com.meveum.entrega.areas.mapper.AreaEntregaMapper;
import br.com.meveum.entrega.repository.AreaEntregaLojaRepository;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListarAreaEntregaService {

    private final ValidarLojaExisteService validarLojaExisteService;
    private final AreaEntregaLojaRepository areaEntregaLojaRepository;
    private final AreaEntregaMapper areaEntregaMapper;

    public List<ListarAreaEntregaResponse> listar(UUID lojaId) {
        validarLojaExisteService.validar(lojaId);

        return areaEntregaLojaRepository.findByLojaIdOrderByNameAsc(lojaId)
            .stream()
            .map(areaEntregaMapper::toListarAreaEntregaResponse)
            .toList();
    }
}
