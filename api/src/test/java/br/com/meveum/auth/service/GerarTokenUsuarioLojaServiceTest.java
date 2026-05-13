package br.com.meveum.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.lojas.entity.Loja;
import br.com.meveum.lojas.entity.UsuarioLoja;
import br.com.meveum.lojas.entity.enums.UsuarioLojaRole;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;

@ExtendWith(MockitoExtension.class)
class GerarTokenUsuarioLojaServiceTest {

    @Mock
    private JwtEncoder jwtEncoder;
    @InjectMocks
    private GerarTokenUsuarioLojaService service;

    @Test
    void deveGerarTokenComClaimsDoUsuario() {
        var usuario = usuario();
        when(jwtEncoder.encode(org.mockito.ArgumentMatchers.any(JwtEncoderParameters.class))).thenReturn(jwt());

        var token = service.gerar(usuario);

        assertThat(token).isEqualTo("token-jwt");
        var captor = ArgumentCaptor.forClass(JwtEncoderParameters.class);
        verify(jwtEncoder).encode(captor.capture());
        var claims = captor.getValue().getClaims().getClaims();
        assertThat(claims.get("sub")).isEqualTo(usuario.getId().toString());
        assertThat(claims.get("email")).isEqualTo(usuario.getEmail());
        assertThat(claims.get("role")).isEqualTo("OWNER");
        assertThat(claims.get("lojaId")).isEqualTo(usuario.getLoja().getId().toString());
    }

    private Jwt jwt() {
        return Jwt.withTokenValue("token-jwt")
            .header("alg", "RS256")
            .issuedAt(Instant.now())
            .expiresAt(Instant.now().plusSeconds(7200))
            .subject(UUID.randomUUID().toString())
            .build();
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
        return usuario;
    }
}
