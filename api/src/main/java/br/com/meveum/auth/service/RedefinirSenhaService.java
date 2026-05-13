package br.com.meveum.auth.service;

import br.com.meveum.auth.dto.RedefinirSenhaRequest;
import br.com.meveum.auth.dto.RedefinirSenhaResponse;
import br.com.meveum.auth.repository.PasswordResetTokenRepository;
import br.com.meveum.auth.validator.AuthValidator;
import br.com.meveum.lojas.repository.UsuarioLojaRepository;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.time.OffsetDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RedefinirSenhaService {

    private final AuthValidator authValidator;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final UsuarioLojaRepository usuarioLojaRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public RedefinirSenhaResponse redefinir(RedefinirSenhaRequest request) {
        authValidator.validarRedefinicaoSenha(request);
        var reset = passwordResetTokenRepository.findByToken(request.token())
            .orElseThrow(() -> new RegraNegocioException("Token de recuperacao invalido."));

        if (reset.getUsedAt() != null) {
            throw new RegraNegocioException("Token de recuperacao ja utilizado.");
        }

        if (reset.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new RegraNegocioException("Token de recuperacao expirado.");
        }

        var usuario = reset.getUsuario();
        usuario.setPasswordHash(passwordEncoder.encode(request.senha()));
        usuarioLojaRepository.save(usuario);

        reset.setUsedAt(OffsetDateTime.now());
        passwordResetTokenRepository.save(reset);

        return RedefinirSenhaResponse.builder()
            .mensagem("Senha redefinida com sucesso.")
            .build();
    }
}
