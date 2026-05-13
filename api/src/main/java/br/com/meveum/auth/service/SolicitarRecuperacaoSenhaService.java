package br.com.meveum.auth.service;

import br.com.meveum.auth.dto.SolicitarRecuperacaoSenhaRequest;
import br.com.meveum.auth.dto.SolicitarRecuperacaoSenhaResponse;
import br.com.meveum.auth.entity.PasswordResetToken;
import br.com.meveum.auth.repository.PasswordResetTokenRepository;
import br.com.meveum.auth.validator.AuthValidator;
import br.com.meveum.lojas.repository.UsuarioLojaRepository;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.HexFormat;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SolicitarRecuperacaoSenhaService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final String MENSAGEM = "Se o email existir, enviaremos as instrucoes para redefinir a senha.";

    private final AuthValidator authValidator;
    private final UsuarioLojaRepository usuarioLojaRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public SolicitarRecuperacaoSenhaResponse solicitar(SolicitarRecuperacaoSenhaRequest request) {
        authValidator.validarSolicitacaoRecuperacaoSenha(request);
        var usuario = usuarioLojaRepository.findByEmailIgnoreCase(request.email().trim().toLowerCase());

        if (usuario.isEmpty()) {
            return SolicitarRecuperacaoSenhaResponse.builder()
                .mensagem(MENSAGEM)
                .build();
        }

        var expiraEm = OffsetDateTime.now().plusMinutes(30);
        var token = gerarToken();
        passwordResetTokenRepository.save(PasswordResetToken.builder()
            .usuario(usuario.get())
            .token(token)
            .expiresAt(expiraEm)
            .createdAt(OffsetDateTime.now())
            .build());

        return SolicitarRecuperacaoSenhaResponse.builder()
            .mensagem(MENSAGEM)
            .token(token)
            .expiraEm(expiraEm)
            .build();
    }

    private String gerarToken() {
        var bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }
}
