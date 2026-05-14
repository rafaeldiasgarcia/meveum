package br.com.meveum.cardapio.complementos.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.complementos.dto.AtualizarGrupoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.AtualizarGrupoComplementoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.complementos.validator.ComplementoValidator;
import br.com.meveum.cardapio.complementos.validator.service.ValidarGrupoComplementoExisteService;
import br.com.meveum.cardapio.complementos.validator.service.ValidarNomeGrupoComplementoDisponivelService;
import br.com.meveum.cardapio.repository.GrupoComplementoRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AtualizarGrupoComplementoService {

    private final ComplementoValidator complementoValidator;
    private final ValidarGrupoComplementoExisteService validarGrupoComplementoExisteService;
    private final ValidarNomeGrupoComplementoDisponivelService validarNomeGrupoComplementoDisponivelService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final GrupoComplementoRepository grupoComplementoRepository;
    private final ComplementoMapper complementoMapper;

    public AtualizarGrupoComplementoResponse atualizar(UUID grupoComplementoId, AtualizarGrupoComplementoRequest request) {
        complementoValidator.validarAtualizacaoGrupo(request);
        var grupoComplemento = validarGrupoComplementoExisteService.validar(grupoComplementoId);
        var lojaId = grupoComplemento.getLoja().getId();
        validarAcessoLojaService.validar(lojaId);
        validarNomeGrupoComplementoDisponivelService.validarAtualizacao(lojaId, grupoComplementoId, request.nome());
        complementoMapper.toEntity(request, grupoComplemento);
        var grupoComplementoSalvo = grupoComplementoRepository.save(grupoComplemento);
        return complementoMapper.toAtualizarGrupoComplementoResponse(grupoComplementoSalvo);
    }
}
