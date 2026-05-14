package br.com.meveum.entrega.areas.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.entrega.areas.validator.service.ValidarAreaEntregaExisteService;
import br.com.meveum.entrega.repository.AreaEntregaLojaRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExcluirAreaEntregaService {

    private final ValidarAreaEntregaExisteService validarAreaEntregaExisteService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final AreaEntregaLojaRepository areaEntregaLojaRepository;

    public void excluir(UUID areaEntregaId) {
        var areaEntrega = validarAreaEntregaExisteService.validar(areaEntregaId);
        validarAcessoLojaService.validar(areaEntrega.getLoja().getId());
        areaEntrega.setActive(false);
        areaEntregaLojaRepository.save(areaEntrega);
    }
}
