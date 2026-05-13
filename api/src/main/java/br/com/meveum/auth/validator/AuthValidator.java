package br.com.meveum.auth.validator;

import br.com.meveum.auth.dto.LoginRequest;
import br.com.meveum.auth.dto.RedefinirSenhaRequest;
import br.com.meveum.auth.dto.RegistrarRequest;
import br.com.meveum.auth.dto.SolicitarRecuperacaoSenhaRequest;
import br.com.meveum.lojas.entity.UsuarioLoja;
import br.com.meveum.shared.exception.NaoAutorizadoException;
import br.com.meveum.shared.exception.RegraNegocioException;
import org.springframework.stereotype.Component;

@Component
public class AuthValidator {

    public void validarLogin(LoginRequest request) {
        if (request.email() == null || request.email().isBlank()) {
            throw new RegraNegocioException("Email e obrigatorio.");
        }

        if (request.senha() == null || request.senha().isBlank()) {
            throw new RegraNegocioException("Senha e obrigatoria.");
        }
    }

    public void validarUsuarioAtivo(UsuarioLoja usuario) {
        if (!Boolean.TRUE.equals(usuario.getActive())) {
            throw new NaoAutorizadoException("Usuario da loja esta inativo.");
        }
    }

    public void validarRegistro(RegistrarRequest request) {
        if (request.nome() == null || request.nome().isBlank()) {
            throw new RegraNegocioException("Nome e obrigatorio.");
        }

        if (request.nomeLoja() == null || request.nomeLoja().isBlank()) {
            throw new RegraNegocioException("Nome da loja e obrigatorio.");
        }

        if (request.telefone() == null || request.telefone().isBlank()) {
            throw new RegraNegocioException("Telefone da loja e obrigatorio.");
        }

        if (request.email() == null || request.email().isBlank()) {
            throw new RegraNegocioException("Email e obrigatorio.");
        }

        if (request.senha() == null || request.senha().isBlank()) {
            throw new RegraNegocioException("Senha e obrigatoria.");
        }

        validarForcaSenha(request.senha());

        if (!request.senha().equals(request.confirmarSenha())) {
            throw new RegraNegocioException("Senhas nao conferem.");
        }
    }

    public void validarSolicitacaoRecuperacaoSenha(SolicitarRecuperacaoSenhaRequest request) {
        if (request.email() == null || request.email().isBlank()) {
            throw new RegraNegocioException("Email e obrigatorio.");
        }
    }

    public void validarRedefinicaoSenha(RedefinirSenhaRequest request) {
        if (request.token() == null || request.token().isBlank()) {
            throw new RegraNegocioException("Token de recuperacao e obrigatorio.");
        }

        if (request.senha() == null || request.senha().isBlank()) {
            throw new RegraNegocioException("Senha e obrigatoria.");
        }

        validarForcaSenha(request.senha());

        if (!request.senha().equals(request.confirmarSenha())) {
            throw new RegraNegocioException("Senhas nao conferem.");
        }
    }

    private void validarForcaSenha(String senha) {
        if (senha.length() < 6) {
            throw new RegraNegocioException("Senha deve ter no minimo 6 caracteres.");
        }
    }
}
