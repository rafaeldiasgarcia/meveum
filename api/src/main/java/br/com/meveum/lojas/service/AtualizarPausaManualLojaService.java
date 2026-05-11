package br.com.meveum.lojas.service;

import br.com.meveum.lojas.dto.AtualizarPausaManualLojaRequest;
import br.com.meveum.lojas.dto.AtualizarPausaManualLojaResponse;
import br.com.meveum.lojas.mapper.LojaMapper;
import br.com.meveum.lojas.repository.LojaRepository;
import br.com.meveum.lojas.validator.LojaValidator;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AtualizarPausaManualLojaService {

    private final LojaValidator lojaValidator;
    private final ValidarLojaExisteService validarLojaExisteService;
    private final LojaRepository lojaRepository;
    private final LojaMapper lojaMapper;

    public AtualizarPausaManualLojaResponse atualizar(UUID lojaId, AtualizarPausaManualLojaRequest request) {
        lojaValidator.validarPausaManual(request);
        var loja = validarLojaExisteService.validar(lojaId);
        loja.setManuallyPaused(request.pausadaManualmente());
        var lojaSalva = lojaRepository.save(loja);
        return lojaMapper.toAtualizarPausaManualLojaResponse(lojaSalva);
    }
}
