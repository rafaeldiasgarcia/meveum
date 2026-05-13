package br.com.meveum.auth.service;

import br.com.meveum.lojas.entity.UsuarioLoja;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GerarTokenUsuarioLojaService {

    private final JwtEncoder jwtEncoder;

    public String gerar(UsuarioLoja usuario) {
        var agora = Instant.now();
        var claims = JwtClaimsSet.builder()
            .issuer("meveum-api")
            .issuedAt(agora)
            .expiresAt(agora.plus(2, ChronoUnit.HOURS))
            .subject(usuario.getId().toString())
            .claim("email", usuario.getEmail())
            .claim("role", usuario.getRole().name())
            .claim("lojaId", usuario.getLoja().getId().toString())
            .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}
