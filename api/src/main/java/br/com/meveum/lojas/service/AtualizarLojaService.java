package br.com.meveum.lojas.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.lojas.dto.AtualizarLojaRequest;
import br.com.meveum.lojas.dto.AtualizarLojaResponse;
import br.com.meveum.lojas.mapper.LojaMapper;
import br.com.meveum.lojas.repository.LojaRepository;
import br.com.meveum.lojas.validator.LojaValidator;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.lojas.validator.service.ValidarSlugLojaDisponivelService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AtualizarLojaService {

    private final LojaValidator lojaValidator;
    private final ValidarLojaExisteService validarLojaExisteService;
    private final ValidarSlugLojaDisponivelService validarSlugLojaDisponivelService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final LojaRepository lojaRepository;
    private final LojaMapper lojaMapper;

    public AtualizarLojaResponse atualizar(UUID lojaId, AtualizarLojaRequest request) {
        lojaValidator.validarAtualizacao(request);
        var loja = validarLojaExisteService.validar(lojaId);
        validarAcessoLojaService.validar(loja.getId());
        validarSlugLojaDisponivelService.validarAtualizacao(lojaId, request.slug());
        lojaMapper.toEntity(request, loja);
        var lojaSalva = lojaRepository.save(loja);
        return lojaMapper.toAtualizarLojaResponse(lojaSalva);
    }
}
