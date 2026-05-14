package br.com.meveum.cardapio.complementos.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.complementos.dto.DetalharGrupoComplementoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.complementos.validator.service.ValidarGrupoComplementoExisteService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DetalharGrupoComplementoService {

    private final ValidarGrupoComplementoExisteService validarGrupoComplementoExisteService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final ComplementoMapper complementoMapper;

    public DetalharGrupoComplementoResponse detalhar(UUID grupoComplementoId) {
        var grupoComplemento = validarGrupoComplementoExisteService.validar(grupoComplementoId);
        validarAcessoLojaService.validar(grupoComplemento.getLoja().getId());
        return complementoMapper.toDetalharGrupoComplementoResponse(grupoComplemento);
    }
}
