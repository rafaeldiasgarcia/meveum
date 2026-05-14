package br.com.meveum.auth.validator;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.meveum.auth.dto.LoginRequest;
import br.com.meveum.auth.dto.RedefinirSenhaRequest;
import br.com.meveum.auth.dto.RegistrarRequest;
import br.com.meveum.auth.dto.SolicitarRecuperacaoSenhaRequest;
import br.com.meveum.lojas.entity.UsuarioLoja;
import br.com.meveum.shared.exception.NaoAutorizadoException;
import br.com.meveum.shared.exception.RegraNegocioException;
import org.junit.jupiter.api.Test;

class AuthValidatorTest {

    private final AuthValidator authValidator = new AuthValidator();

    @Test
    void deveValidarLogin() {
        var request = new LoginRequest("admin@meveum.com", "meveum123");

        assertThatCode(() -> authValidator.validarLogin(request)).doesNotThrowAnyException();
    }

    @Test
    void deveRecusarLoginSemEmail() {
        var request = new LoginRequest(" ", "meveum123");

        assertThatThrownBy(() -> authValidator.validarLogin(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Email e obrigatorio.");
    }

    @Test
    void deveRecusarLoginSemSenha() {
        var request = new LoginRequest("admin@meveum.com", " ");

        assertThatThrownBy(() -> authValidator.validarLogin(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Senha e obrigatoria.");
    }

    @Test
    void deveValidarUsuarioAtivo() {
        var usuario = new UsuarioLoja();
        usuario.setActive(true);

        assertThatCode(() -> authValidator.validarUsuarioAtivo(usuario)).doesNotThrowAnyException();
    }

    @Test
    void deveRecusarUsuarioInativo() {
        var usuario = new UsuarioLoja();
        usuario.setActive(false);

        assertThatThrownBy(() -> authValidator.validarUsuarioAtivo(usuario))
            .isInstanceOf(NaoAutorizadoException.class)
            .hasMessage("Usuario da loja esta inativo.");
    }

    @Test
    void deveValidarRegistro() {
        var request = registro("Rafael", "Loja", "11999999999", "admin@meveum.com", "meveum123", "meveum123");

        assertThatCode(() -> authValidator.validarRegistro(request)).doesNotThrowAnyException();
    }

    @Test
    void deveRecusarRegistroComSenhasDiferentes() {
        var request = registro("Rafael", "Loja", "11999999999", "admin@meveum.com", "meveum123", "outra123");

        assertThatThrownBy(() -> authValidator.validarRegistro(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Senhas nao conferem.");
    }

    @Test
    void deveRecusarRegistroSemNome() {
        var request = registro(" ", "Loja", "11999999999", "admin@meveum.com", "meveum123", "meveum123");

        assertThatThrownBy(() -> authValidator.validarRegistro(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Nome e obrigatorio.");
    }

    @Test
    void deveRecusarRegistroSemNomeLoja() {
        var request = registro("Rafael", " ", "11999999999", "admin@meveum.com", "meveum123", "meveum123");

        assertThatThrownBy(() -> authValidator.validarRegistro(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Nome da loja e obrigatorio.");
    }

    @Test
    void deveRecusarRegistroSemTelefone() {
        var request = registro("Rafael", "Loja", " ", "admin@meveum.com", "meveum123", "meveum123");

        assertThatThrownBy(() -> authValidator.validarRegistro(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Telefone da loja e obrigatorio.");
    }

    @Test
    void deveRecusarRegistroSemEmail() {
        var request = registro("Rafael", "Loja", "11999999999", " ", "meveum123", "meveum123");

        assertThatThrownBy(() -> authValidator.validarRegistro(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Email e obrigatorio.");
    }

    @Test
    void deveRecusarRegistroSemSenha() {
        var request = registro("Rafael", "Loja", "11999999999", "admin@meveum.com", " ", "meveum123");

        assertThatThrownBy(() -> authValidator.validarRegistro(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Senha e obrigatoria.");
    }

    @Test
    void deveRecusarRegistroComSenhaCurta() {
        var request = registro("Rafael", "Loja", "11999999999", "admin@meveum.com", "12345", "12345");

        assertThatThrownBy(() -> authValidator.validarRegistro(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Senha deve ter no minimo 6 caracteres.");
    }

    @Test
    void deveValidarSolicitacaoRecuperacaoSenha() {
        var request = new SolicitarRecuperacaoSenhaRequest("admin@meveum.com");

        assertThatCode(() -> authValidator.validarSolicitacaoRecuperacaoSenha(request)).doesNotThrowAnyException();
    }

    @Test
    void deveRecusarSolicitacaoRecuperacaoSenhaSemEmail() {
        var request = new SolicitarRecuperacaoSenhaRequest(" ");

        assertThatThrownBy(() -> authValidator.validarSolicitacaoRecuperacaoSenha(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Email e obrigatorio.");
    }

    @Test
    void deveValidarRedefinicaoSenha() {
        var request = new RedefinirSenhaRequest("token", "meveum123", "meveum123");

        assertThatCode(() -> authValidator.validarRedefinicaoSenha(request)).doesNotThrowAnyException();
    }

    @Test
    void deveRecusarRedefinicaoSenhaSemToken() {
        var request = new RedefinirSenhaRequest(" ", "meveum123", "meveum123");

        assertThatThrownBy(() -> authValidator.validarRedefinicaoSenha(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Token de recuperacao e obrigatorio.");
    }

    @Test
    void deveRecusarRedefinicaoSenhaSemSenha() {
        var request = new RedefinirSenhaRequest("token", " ", "meveum123");

        assertThatThrownBy(() -> authValidator.validarRedefinicaoSenha(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Senha e obrigatoria.");
    }

    @Test
    void deveRecusarRedefinicaoSenhaComSenhaCurta() {
        var request = new RedefinirSenhaRequest("token", "12345", "12345");

        assertThatThrownBy(() -> authValidator.validarRedefinicaoSenha(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Senha deve ter no minimo 6 caracteres.");
    }

    @Test
    void deveRecusarRedefinicaoSenhaComSenhasDiferentes() {
        var request = new RedefinirSenhaRequest("token", "meveum123", "outra123");

        assertThatThrownBy(() -> authValidator.validarRedefinicaoSenha(request))
            .isInstanceOf(RegraNegocioException.class)
            .hasMessage("Senhas nao conferem.");
    }

    private RegistrarRequest registro(String nome, String nomeLoja, String telefone, String email, String senha, String confirmarSenha) {
        return new RegistrarRequest(nome, nomeLoja, telefone, email, senha, confirmarSenha);
    }
}
