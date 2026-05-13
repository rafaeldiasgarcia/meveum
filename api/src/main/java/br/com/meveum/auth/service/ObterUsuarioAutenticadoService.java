package br.com.meveum.auth.service;

import br.com.meveum.auth.dto.ObterUsuarioAutenticadoResponse;
import br.com.meveum.auth.mapper.AuthMapper;
import br.com.meveum.auth.validator.AuthValidator;
import br.com.meveum.lojas.entity.UsuarioLoja;
import br.com.meveum.lojas.repository.UsuarioLojaRepository;
import br.com.meveum.shared.exception.NaoAutorizadoException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ObterUsuarioAutenticadoService {

    private final UsuarioLojaRepository usuarioLojaRepository;
    private final AuthValidator authValidator;
    private final AuthMapper authMapper;

    public ObterUsuarioAutenticadoResponse obter() {
        var usuario = getUsuarioAutenticado();
        return authMapper.toObterUsuarioAutenticadoResponse(usuario);
    }

    public UsuarioLoja getUsuarioAutenticado() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            throw new NaoAutorizadoException("Usuario nao autenticado.");
        }

        UUID usuarioId;
        try {
            usuarioId = UUID.fromString(jwt.getSubject());
        } catch (IllegalArgumentException exception) {
            throw new NaoAutorizadoException("Usuario nao autenticado.");
        }

        var usuario = usuarioLojaRepository.findById(usuarioId)
            .orElseThrow(() -> new NaoAutorizadoException("Usuario nao autenticado."));

        authValidator.validarUsuarioAtivo(usuario);
        return usuario;
    }
}
