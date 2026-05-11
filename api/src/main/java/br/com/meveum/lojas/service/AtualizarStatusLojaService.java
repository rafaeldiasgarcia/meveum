package br.com.meveum.lojas.service;

import br.com.meveum.lojas.dto.AtualizarStatusLojaRequest;
import br.com.meveum.lojas.dto.AtualizarStatusLojaResponse;
import br.com.meveum.lojas.mapper.LojaMapper;
import br.com.meveum.lojas.repository.LojaRepository;
import br.com.meveum.lojas.validator.LojaValidator;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AtualizarStatusLojaService {

    private final LojaValidator lojaValidator;
    private final ValidarLojaExisteService validarLojaExisteService;
    private final LojaRepository lojaRepository;
    private final LojaMapper lojaMapper;

    public AtualizarStatusLojaResponse atualizar(UUID lojaId, AtualizarStatusLojaRequest request) {
        lojaValidator.validarStatus(request);
        var loja = validarLojaExisteService.validar(lojaId);
        loja.setStatus(request.status());
        var lojaSalva = lojaRepository.save(loja);
        return lojaMapper.toAtualizarStatusLojaResponse(lojaSalva);
    }
}
