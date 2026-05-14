package br.com.meveum.cardapio.complementos.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.complementos.dto.AtualizarOpcaoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.AtualizarOpcaoComplementoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.complementos.validator.ComplementoValidator;
import br.com.meveum.cardapio.complementos.validator.service.ValidarNomeOpcaoComplementoDisponivelService;
import br.com.meveum.cardapio.complementos.validator.service.ValidarOpcaoComplementoExisteService;
import br.com.meveum.cardapio.repository.OpcaoComplementoRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AtualizarOpcaoComplementoService {

    private final ComplementoValidator complementoValidator;
    private final ValidarOpcaoComplementoExisteService validarOpcaoComplementoExisteService;
    private final ValidarNomeOpcaoComplementoDisponivelService validarNomeOpcaoComplementoDisponivelService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final OpcaoComplementoRepository opcaoComplementoRepository;
    private final ComplementoMapper complementoMapper;

    public AtualizarOpcaoComplementoResponse atualizar(UUID opcaoComplementoId, AtualizarOpcaoComplementoRequest request) {
        complementoValidator.validarAtualizacaoOpcao(request);
        var opcaoComplemento = validarOpcaoComplementoExisteService.validar(opcaoComplementoId);
        validarAcessoLojaService.validar(opcaoComplemento.getLoja().getId());
        var grupoComplementoId = opcaoComplemento.getGrupoComplemento().getId();
        validarNomeOpcaoComplementoDisponivelService.validarAtualizacao(
            grupoComplementoId,
            opcaoComplementoId,
            request.nome()
        );
        complementoMapper.toEntity(request, opcaoComplemento);
        var opcaoComplementoSalva = opcaoComplementoRepository.save(opcaoComplemento);
        return complementoMapper.toAtualizarOpcaoComplementoResponse(opcaoComplementoSalva);
    }
}
