package br.com.meveum.auth.validator.service;

import br.com.meveum.auth.service.ObterUsuarioAutenticadoService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarAcessoLojaService {

    private final ObterUsuarioAutenticadoService obterUsuarioAutenticadoService;

    public void validar(UUID lojaId) {
        var usuario = obterUsuarioAutenticadoService.getUsuarioAutenticado();

        if (!usuario.getLoja().getId().equals(lojaId)) {
            throw new AccessDeniedException("Acesso negado.");
        }
    }
}
