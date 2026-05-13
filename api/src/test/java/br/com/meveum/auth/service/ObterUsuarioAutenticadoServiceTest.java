package br.com.meveum.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.dto.ObterUsuarioAutenticadoResponse;
import br.com.meveum.auth.mapper.AuthMapper;
import br.com.meveum.auth.validator.AuthValidator;
import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.entity.UsuarioLoja;
import br.com.meveum.lojas.entity.enums.UsuarioLojaRole;
import br.com.meveum.lojas.repository.UsuarioLojaRepository;
import br.com.meveum.shared.exception.NaoAutorizadoException;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

@ExtendWith(MockitoExtension.class)
class ObterUsuarioAutenticadoServiceTest {

    @Mock
    private UsuarioLojaRepository usuarioLojaRepository;
    @Mock
    private AuthValidator authValidator;
    @Mock
    private AuthMapper authMapper;
    @InjectMocks
    private ObterUsuarioAutenticadoService service;

    @AfterEach
    void limparContexto() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void deveObterUsuarioAutenticado() {
        var usuario = usuario();
        var response = ObterUsuarioAutenticadoResponse.builder().id(usuario.getId()).build();
        autenticar(usuario.getId().toString());
        when(usuarioLojaRepository.findById(usuario.getId())).thenReturn(Optional.of(usuario));
        when(authMapper.toObterUsuarioAutenticadoResponse(usuario)).thenReturn(response);

        var resultado = service.obter();

        assertThat(resultado).isEqualTo(response);
        verify(authValidator).validarUsuarioAtivo(usuario);
    }

    @Test
    void deveRetornarUsuarioAutenticado() {
        var usuario = usuario();
        autenticar(usuario.getId().toString());
        when(usuarioLojaRepository.findById(usuario.getId())).thenReturn(Optional.of(usuario));

        var resultado = service.getUsuarioAutenticado();

        assertThat(resultado).isEqualTo(usuario);
    }

    @Test
    void deveRecusarSemAutenticacao() {
        assertThatThrownBy(() -> service.getUsuarioAutenticado())
            .isInstanceOf(NaoAutorizadoException.class)
            .hasMessage("Usuario nao autenticado.");
    }

    @Test
    void deveRecusarSubjectInvalido() {
        autenticar("nao-e-uuid");

        assertThatThrownBy(() -> service.getUsuarioAutenticado())
            .isInstanceOf(NaoAutorizadoException.class)
            .hasMessage("Usuario nao autenticado.");
    }

    @Test
    void deveRecusarUsuarioNaoEncontrado() {
        var usuarioId = UUID.randomUUID();
        autenticar(usuarioId.toString());
        when(usuarioLojaRepository.findById(usuarioId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getUsuarioAutenticado())
            .isInstanceOf(NaoAutorizadoException.class)
            .hasMessage("Usuario nao autenticado.");
    }

    private void autenticar(String subject) {
        var jwt = Jwt.withTokenValue("token-jwt")
            .header("alg", "RS256")
            .issuedAt(Instant.now())
            .expiresAt(Instant.now().plusSeconds(7200))
            .subject(subject)
            .build();
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(jwt, null));
    }

    private UsuarioLoja usuario() {
        var loja = new Loja();
        loja.setId(UUID.randomUUID());

        var usuario = new UsuarioLoja();
        usuario.setId(UUID.randomUUID());
        usuario.setLoja(loja);
        usuario.setName("Admin Meveum");
        usuario.setEmail("admin@meveum.com");
        usuario.setRole(UsuarioLojaRole.OWNER);
        usuario.setActive(true);
        return usuario;
    }
}
