package br.com.meveum.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.auth.dto.SolicitarRecuperacaoSenhaRequest;
import br.com.meveum.auth.entity.PasswordResetToken;
import br.com.meveum.auth.repository.PasswordResetTokenRepository;
import br.com.meveum.auth.validator.AuthValidator;
import br.com.meveum.lojas.entity.UsuarioLoja;
import br.com.meveum.lojas.repository.UsuarioLojaRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SolicitarRecuperacaoSenhaServiceTest {

    @Mock
    private AuthValidator authValidator;
    @Mock
    private UsuarioLojaRepository usuarioLojaRepository;
    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;
    @InjectMocks
    private SolicitarRecuperacaoSenhaService service;

    @Test
    void deveGerarTokenQuandoEmailExistir() {
        var request = new SolicitarRecuperacaoSenhaRequest(" ADMIN@MEVEUM.COM ");
        var usuario = new UsuarioLoja();
        when(usuarioLojaRepository.findByEmailIgnoreCase("admin@meveum.com")).thenReturn(Optional.of(usuario));

        var response = service.solicitar(request);

        var captor = ArgumentCaptor.forClass(PasswordResetToken.class);
        verify(authValidator).validarSolicitacaoRecuperacaoSenha(request);
        verify(passwordResetTokenRepository).save(captor.capture());
        assertThat(response.mensagem()).isEqualTo("Se o email existir, enviaremos as instrucoes para redefinir a senha.");
        assertThat(response.token()).hasSize(64);
        assertThat(response.expiraEm()).isNotNull();
        assertThat(captor.getValue().getUsuario()).isEqualTo(usuario);
        assertThat(captor.getValue().getToken()).isEqualTo(response.token());
        assertThat(captor.getValue().getExpiresAt()).isEqualTo(response.expiraEm());
        assertThat(captor.getValue().getCreatedAt()).isNotNull();
    }

    @Test
    void deveRetornarMensagemGenericaQuandoEmailNaoExistir() {
        var request = new SolicitarRecuperacaoSenhaRequest("admin@meveum.com");
        when(usuarioLojaRepository.findByEmailIgnoreCase("admin@meveum.com")).thenReturn(Optional.empty());

        var response = service.solicitar(request);

        verify(authValidator).validarSolicitacaoRecuperacaoSenha(request);
        verify(passwordResetTokenRepository, never()).save(any());
        assertThat(response.mensagem()).isEqualTo("Se o email existir, enviaremos as instrucoes para redefinir a senha.");
        assertThat(response.token()).isNull();
        assertThat(response.expiraEm()).isNull();
    }
}
