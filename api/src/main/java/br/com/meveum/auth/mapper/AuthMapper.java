package br.com.meveum.auth.mapper;

import br.com.meveum.auth.dto.LoginResponse;
import br.com.meveum.auth.dto.ObterUsuarioAutenticadoResponse;
import br.com.meveum.auth.dto.RegistrarRequest;
import br.com.meveum.auth.dto.RegistrarResponse;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.entity.UsuarioLoja;
import br.com.meveum.lojas.entity.enums.LojaStatus;
import br.com.meveum.lojas.entity.enums.UsuarioLojaRole;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public LoginResponse toLoginResponse(UsuarioLoja usuario, String token) {
        return LoginResponse.builder()
            .token(token)
            .usuario(toUsuarioAutenticadoResponse(usuario))
            .build();
    }

    public RegistrarResponse toRegistrarResponse(UsuarioLoja usuario, String token) {
        return RegistrarResponse.builder()
            .token(token)
            .usuario(toUsuarioAutenticadoResponse(usuario))
            .build();
    }

    public Loja toEntity(RegistrarRequest request, String slug, String whatsappNumber) {
        var loja = new Loja();
        loja.setName(request.nomeLoja().trim());
        loja.setSlug(slug);
        loja.setWhatsappNumber(whatsappNumber);
        loja.setStatus(LojaStatus.ACTIVE);
        loja.setManuallyPaused(false);
        return loja;
    }

    public UsuarioLoja toEntity(RegistrarRequest request, String passwordHash) {
        var usuario = new UsuarioLoja();
        usuario.setName(request.nome().trim());
        usuario.setEmail(request.email().trim().toLowerCase());
        usuario.setPasswordHash(passwordHash);
        usuario.setRole(UsuarioLojaRole.OWNER);
        usuario.setActive(true);
        return usuario;
    }

    public LoginResponse.UsuarioAutenticadoResponse toUsuarioAutenticadoResponse(UsuarioLoja usuario) {
        return LoginResponse.UsuarioAutenticadoResponse.builder()
            .id(usuario.getId())
            .lojaId(usuario.getLoja().getId())
            .nome(usuario.getName())
            .email(usuario.getEmail())
            .role(usuario.getRole().name())
            .build();
    }

    public ObterUsuarioAutenticadoResponse toObterUsuarioAutenticadoResponse(UsuarioLoja usuario) {
        return ObterUsuarioAutenticadoResponse.builder()
            .id(usuario.getId())
            .lojaId(usuario.getLoja().getId())
            .nome(usuario.getName())
            .email(usuario.getEmail())
            .role(usuario.getRole().name())
            .build();
    }
}
