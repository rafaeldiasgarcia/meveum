package br.com.meveum.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.dto.LoginRequest;
import br.com.meveum.auth.dto.LoginResponse;
import br.com.meveum.auth.mapper.AuthMapper;
import br.com.meveum.auth.validator.AuthValidator;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.entity.UsuarioLoja;
import br.com.meveum.lojas.entity.enums.UsuarioLojaRole;
import br.com.meveum.lojas.repository.UsuarioLojaRepository;
import br.com.meveum.shared.exception.NaoAutorizadoException;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class LoginServiceTest {

    @Mock
    private AuthValidator authValidator;
    @Mock
    private UsuarioLojaRepository usuarioLojaRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private GerarTokenUsuarioLojaService gerarTokenUsuarioLojaService;
    @Mock
    private AuthMapper authMapper;
    @InjectMocks
    private LoginService service;

    @Test
    void deveAutenticarUsuario() {
        var request = new LoginRequest(" ADMIN@MEVEUM.COM ", "meveum123");
        var usuario = usuario();
        var response = LoginResponse.builder().token("token-jwt").build();
        when(usuarioLojaRepository.findByEmailIgnoreCase("admin@meveum.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("meveum123", usuario.getPasswordHash())).thenReturn(true);
        when(gerarTokenUsuarioLojaService.gerar(usuario)).thenReturn("token-jwt");
        when(authMapper.toLoginResponse(usuario, "token-jwt")).thenReturn(response);

        var resultado = service.login(request);

        assertThat(resultado).isEqualTo(response);
        verify(authValidator).validarLogin(request);
        verify(authValidator).validarUsuarioAtivo(usuario);
        verify(gerarTokenUsuarioLojaService).gerar(usuario);
    }

    @Test
    void deveRecusarEmailInexistente() {
        var request = new LoginRequest("admin@meveum.com", "meveum123");
        when(usuarioLojaRepository.findByEmailIgnoreCase("admin@meveum.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.login(request))
            .isInstanceOf(NaoAutorizadoException.class)
            .hasMessage("Credenciais invalidas.");
    }

    @Test
    void deveRecusarSenhaInvalida() {
        var request = new LoginRequest("admin@meveum.com", "errada");
        var usuario = usuario();
        when(usuarioLojaRepository.findByEmailIgnoreCase("admin@meveum.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("errada", usuario.getPasswordHash())).thenReturn(false);

        assertThatThrownBy(() -> service.login(request))
            .isInstanceOf(NaoAutorizadoException.class)
            .hasMessage("Credenciais invalidas.");
    }

    private UsuarioLoja usuario() {
        var loja = new Loja();
        loja.setId(UUID.randomUUID());

        var usuario = new UsuarioLoja();
        usuario.setId(UUID.randomUUID());
        usuario.setLoja(loja);
        usuario.setName("Admin Meveum");
        usuario.setEmail("admin@meveum.com");
        usuario.setPasswordHash("hash");
        usuario.setRole(UsuarioLojaRole.OWNER);
        usuario.setActive(true);
        return usuario;
    }
}
