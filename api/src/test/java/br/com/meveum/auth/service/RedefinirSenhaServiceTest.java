package br.com.meveum.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.dto.RedefinirSenhaRequest;
import br.com.meveum.auth.entity.PasswordResetToken;
import br.com.meveum.auth.repository.PasswordResetTokenRepository;
import br.com.meveum.auth.validator.AuthValidator;
import br.com.meveum.lojas.entity.UsuarioLoja;
import br.com.meveum.lojas.repository.UsuarioLojaRepository;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.time.OffsetDateTime;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class RedefinirSenhaServiceTest {

    @Mock
    private AuthValidator authValidator;
    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;
    @Mock
    private UsuarioLojaRepository usuarioLojaRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @InjectMocks
    private RedefinirSenhaService service;

    @Test
    void deveRedefinirSenha() {
        var request = new RedefinirSenhaRequest("token", "nova123", "nova123");
        var usuario = new UsuarioLoja();
        var reset = PasswordResetToken.builder()
            .usuario(usuario)
            .token("token")
            .expiresAt(OffsetDateTime.now().plusMinutes(5))
            .createdAt(OffsetDateTime.now())
            .build();
        when(passwordResetTokenRepository.findByToken("token")).thenReturn(Optional.of(reset));
        when(passwordEncoder.encode("nova123")).thenReturn("hash-novo");

        var response = service.redefinir(request);

        assertThat(response.mensagem()).isEqualTo("Senha redefinida com sucesso.");
        assertThat(usuario.getPasswordHash()).isEqualTo("hash-novo");
        assertThat(reset.getUsedAt()).isNotNull();
        verify(authValidator).validarRedefinicaoSenha(request);
        verify(usuarioLojaRepository).save(usuario);
        verify(passwordResetTokenRepository).save(reset);
    }

    @Test
    void deveFalharQuandoTokenNaoExistir() {
        var request = new RedefinirSenhaRequest("token", "nova123", "nova123");
        when(passwordResetTokenRepository.findByToken("token")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.redefinir(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Token de recuperacao invalido.");
    }

    @Test
    void deveFalharQuandoTokenJaFoiUtilizado() {
        var request = new RedefinirSenhaRequest("token", "nova123", "nova123");
        var reset = PasswordResetToken.builder()
            .usuario(new UsuarioLoja())
            .token("token")
            .expiresAt(OffsetDateTime.now().plusMinutes(5))
            .usedAt(OffsetDateTime.now())
            .createdAt(OffsetDateTime.now())
            .build();
        when(passwordResetTokenRepository.findByToken("token")).thenReturn(Optional.of(reset));

        assertThatThrownBy(() -> service.redefinir(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Token de recuperacao ja utilizado.");
    }

    @Test
    void deveFalharQuandoTokenExpirou() {
        var request = new RedefinirSenhaRequest("token", "nova123", "nova123");
        var reset = PasswordResetToken.builder()
            .usuario(new UsuarioLoja())
            .token("token")
            .expiresAt(OffsetDateTime.now().minusMinutes(1))
            .createdAt(OffsetDateTime.now())
            .build();
        when(passwordResetTokenRepository.findByToken("token")).thenReturn(Optional.of(reset));

        assertThatThrownBy(() -> service.redefinir(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Token de recuperacao expirado.");
    }
}
