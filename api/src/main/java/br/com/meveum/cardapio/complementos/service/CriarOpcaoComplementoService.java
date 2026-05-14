package br.com.meveum.cardapio.complementos.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.complementos.dto.CriarOpcaoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.CriarOpcaoComplementoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.complementos.validator.ComplementoValidator;
import br.com.meveum.cardapio.complementos.validator.service.ValidarGrupoComplementoExisteService;
import br.com.meveum.cardapio.complementos.validator.service.ValidarLojaComplementoExisteService;
import br.com.meveum.cardapio.complementos.validator.service.ValidarNomeOpcaoComplementoDisponivelService;
import br.com.meveum.cardapio.repository.OpcaoComplementoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CriarOpcaoComplementoService {

    private final ComplementoValidator complementoValidator;
    private final ValidarLojaComplementoExisteService validarLojaComplementoExisteService;
    private final ValidarGrupoComplementoExisteService validarGrupoComplementoExisteService;
    private final ValidarNomeOpcaoComplementoDisponivelService validarNomeOpcaoComplementoDisponivelService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final OpcaoComplementoRepository opcaoComplementoRepository;
    private final ComplementoMapper complementoMapper;

    public CriarOpcaoComplementoResponse criar(CriarOpcaoComplementoRequest request) {
        complementoValidator.validarCriacaoOpcao(request);
        var loja = validarLojaComplementoExisteService.validar(request.lojaId());
        validarAcessoLojaService.validar(loja.getId());
        var grupoComplemento = validarGrupoComplementoExisteService.validarAtivo(
            request.grupoComplementoId(),
            request.lojaId()
        );
        validarNomeOpcaoComplementoDisponivelService.validarCriacao(request.grupoComplementoId(), request.nome());
        var opcaoComplemento = complementoMapper.toEntity(request);
        opcaoComplemento.setLoja(loja);
        opcaoComplemento.setGrupoComplemento(grupoComplemento);
        var opcaoComplementoSalva = opcaoComplementoRepository.save(opcaoComplemento);
        return complementoMapper.toCriarOpcaoComplementoResponse(opcaoComplementoSalva);
    }
}
