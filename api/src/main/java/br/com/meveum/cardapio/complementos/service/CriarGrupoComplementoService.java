package br.com.meveum.cardapio.complementos.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.complementos.dto.CriarGrupoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.CriarGrupoComplementoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.complementos.validator.ComplementoValidator;
import br.com.meveum.cardapio.complementos.validator.service.ValidarLojaComplementoExisteService;
import br.com.meveum.cardapio.complementos.validator.service.ValidarNomeGrupoComplementoDisponivelService;
import br.com.meveum.cardapio.repository.GrupoComplementoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CriarGrupoComplementoService {

    private final ComplementoValidator complementoValidator;
    private final ValidarLojaComplementoExisteService validarLojaComplementoExisteService;
    private final ValidarNomeGrupoComplementoDisponivelService validarNomeGrupoComplementoDisponivelService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final GrupoComplementoRepository grupoComplementoRepository;
    private final ComplementoMapper complementoMapper;

    public CriarGrupoComplementoResponse criar(CriarGrupoComplementoRequest request) {
        complementoValidator.validarCriacaoGrupo(request);
        var loja = validarLojaComplementoExisteService.validar(request.lojaId());
        validarAcessoLojaService.validar(loja.getId());
        validarNomeGrupoComplementoDisponivelService.validarCriacao(request.lojaId(), request.nome());
        var grupoComplemento = complementoMapper.toEntity(request);
        grupoComplemento.setLoja(loja);
        var grupoComplementoSalvo = grupoComplementoRepository.save(grupoComplemento);
        return complementoMapper.toCriarGrupoComplementoResponse(grupoComplementoSalvo);
    }
}
