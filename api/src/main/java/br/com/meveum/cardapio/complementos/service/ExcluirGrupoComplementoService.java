package br.com.meveum.cardapio.complementos.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.complementos.validator.service.ValidarGrupoComplementoExisteService;
import br.com.meveum.cardapio.repository.GrupoComplementoRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExcluirGrupoComplementoService {

    private final ValidarGrupoComplementoExisteService validarGrupoComplementoExisteService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final GrupoComplementoRepository grupoComplementoRepository;

    public void excluir(UUID grupoComplementoId) {
        var grupoComplemento = validarGrupoComplementoExisteService.validar(grupoComplementoId);
        validarAcessoLojaService.validar(grupoComplemento.getLoja().getId());
        grupoComplemento.setActive(false);
        grupoComplementoRepository.save(grupoComplemento);
    }
}
