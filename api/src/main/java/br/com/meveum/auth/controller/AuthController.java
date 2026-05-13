package br.com.meveum.auth.controller;

import br.com.meveum.auth.dto.LoginRequest;
import br.com.meveum.auth.dto.LoginResponse;
import br.com.meveum.auth.dto.ObterUsuarioAutenticadoResponse;
import br.com.meveum.auth.dto.RegistrarRequest;
import br.com.meveum.auth.dto.RegistrarResponse;
import br.com.meveum.auth.service.LoginService;
import br.com.meveum.auth.service.ObterUsuarioAutenticadoService;
import br.com.meveum.auth.service.RegistrarService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public ObterUsuarioAutenticadoResponse obterUsuarioAutenticado() {
        return obterUsuarioAutenticadoService.obter();
    }
}
