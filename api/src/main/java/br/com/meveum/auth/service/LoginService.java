package br.com.meveum.auth.service;

import br.com.meveum.auth.dto.LoginRequest;
import br.com.meveum.auth.dto.LoginResponse;
import br.com.meveum.auth.mapper.AuthMapper;
import br.com.meveum.auth.validator.AuthValidator;
import br.com.meveum.lojas.entity.UsuarioLoja;
import br.com.meveum.lojas.repository.UsuarioLojaRepository;
import br.com.meveum.shared.exception.NaoAutorizadoException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final AuthValidator authValidator;
    private final UsuarioLojaRepository usuarioLojaRepository;
    private final PasswordEncoder passwordEncoder;
    private final GerarTokenUsuarioLojaService gerarTokenUsuarioLojaService;
    private final AuthMapper authMapper;

    public LoginResponse login(LoginRequest request) {
        authValidator.validarLogin(request);
        var email = request.email().trim().toLowerCase();
        var usuario = usuarioLojaRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new NaoAutorizadoException("Credenciais invalidas."));

        if (!passwordEncoder.matches(request.senha(), usuario.getPasswordHash())) {
            throw new NaoAutorizadoException("Credenciais invalidas.");
        }

        authValidator.validarUsuarioAtivo(usuario);
        var token = gerarTokenUsuarioLojaService.gerar(usuario);
        return authMapper.toLoginResponse(usuario, token);
    }
}
