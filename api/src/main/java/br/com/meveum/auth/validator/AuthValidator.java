package br.com.meveum.auth.validator;

import br.com.meveum.auth.dto.LoginRequest;
import br.com.meveum.auth.dto.RegistrarRequest;
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

        if (!request.senha().equals(request.confirmarSenha())) {
            throw new RegraNegocioException("Senhas nao conferem.");
        }
    }
}
