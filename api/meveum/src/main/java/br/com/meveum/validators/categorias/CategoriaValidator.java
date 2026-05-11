package br.com.meveum.validators.categorias;

import br.com.meveum.dtos.categorias.AtualizarCategoriaRequest;
import br.com.meveum.dtos.categorias.CriarCategoriaRequest;
import br.com.meveum.exceptions.RegraNegocioException;
import org.springframework.stereotype.Component;

@Component
public class CategoriaValidator {

    public void validarCriacao(CriarCategoriaRequest request) {
        validarNome(request.nome());
        validarOrdem(request.ordem());
    }

    public void validarAtualizacao(AtualizarCategoriaRequest request) {
        validarNome(request.nome());
        validarOrdem(request.ordem());
    }

    private void validarNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new RegraNegocioException("Nome da categoria e obrigatorio.");
        }
    }

    private void validarOrdem(Integer ordem) {
        if (ordem != null && ordem < 0) {
            throw new RegraNegocioException("Ordem da categoria nao pode ser negativa.");
        }
    }
}
