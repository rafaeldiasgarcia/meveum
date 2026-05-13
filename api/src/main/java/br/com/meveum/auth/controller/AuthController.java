package br.com.meveum.auth.controller;

import br.com.meveum.auth.dto.LoginRequest;
import br.com.meveum.auth.dto.LoginResponse;
import br.com.meveum.auth.dto.ObterUsuarioAutenticadoResponse;
import br.com.meveum.auth.dto.ObterUrlOAuthResponse;
import br.com.meveum.auth.dto.RedefinirSenhaRequest;
import br.com.meveum.auth.dto.RedefinirSenhaResponse;
import br.com.meveum.auth.dto.RegistrarRequest;
import br.com.meveum.auth.dto.RegistrarResponse;
import br.com.meveum.auth.dto.SolicitarRecuperacaoSenhaRequest;
import br.com.meveum.auth.dto.SolicitarRecuperacaoSenhaResponse;
import br.com.meveum.auth.service.LoginService;
import br.com.meveum.auth.service.ObterUrlOAuthService;
import br.com.meveum.auth.service.ObterUsuarioAutenticadoService;
import br.com.meveum.auth.service.RedefinirSenhaService;
import br.com.meveum.auth.service.RegistrarService;
import br.com.meveum.auth.service.SolicitarRecuperacaoSenhaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final LoginService loginService;
    private final ObterUsuarioAutenticadoService obterUsuarioAutenticadoService;
    private final RegistrarService registrarService;
    private final SolicitarRecuperacaoSenhaService solicitarRecuperacaoSenhaService;
    private final RedefinirSenhaService redefinirSenhaService;
    private final ObterUrlOAuthService obterUrlOAuthService;

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return loginService.login(request);
    }

    @PostMapping("/registrar")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistrarResponse registrar(@Valid @RequestBody RegistrarRequest request) {
        return registrarService.registrar(request);
    }

    @PostMapping("/esqueci-senha")
    @ResponseStatus(HttpStatus.OK)
    public SolicitarRecuperacaoSenhaResponse solicitarRecuperacaoSenha(
        @Valid @RequestBody SolicitarRecuperacaoSenhaRequest request
    ) {
        return solicitarRecuperacaoSenhaService.solicitar(request);
    }

    @PostMapping("/redefinir-senha")
    @ResponseStatus(HttpStatus.OK)
    public RedefinirSenhaResponse redefinirSenha(@Valid @RequestBody RedefinirSenhaRequest request) {
        return redefinirSenhaService.redefinir(request);
    }

    @GetMapping("/oauth/{provedor}")
    @ResponseStatus(HttpStatus.OK)
    public ObterUrlOAuthResponse obterUrlOAuth(@PathVariable String provedor) {
        return obterUrlOAuthService.obter(provedor);
    }

    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public ObterUsuarioAutenticadoResponse obterUsuarioAutenticado() {
        return obterUsuarioAutenticadoService.obter();
    }
}
