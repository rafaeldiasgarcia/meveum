package br.com.meveum.entrega.areas.validator.service;

import br.com.meveum.entrega.entity.AreaEntregaLoja;
import br.com.meveum.entrega.repository.AreaEntregaLojaRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarAreaEntregaExisteService {

    private final AreaEntregaLojaRepository areaEntregaLojaRepository;

    public AreaEntregaLoja validar(UUID areaEntregaId) {
        return areaEntregaLojaRepository.findById(areaEntregaId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Area de entrega nao encontrada."));
    }

    public AreaEntregaLoja validar(UUID areaEntregaId, UUID lojaId) {
        return areaEntregaLojaRepository.findByIdAndLojaId(areaEntregaId, lojaId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Area de entrega nao encontrada."));
    }
}
