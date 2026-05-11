package br.com.meveum.cardapio.categorias.validator;

import br.com.meveum.cardapio.categorias.dto.AtualizarCategoriaRequest;
import br.com.meveum.cardapio.categorias.dto.CriarCategoriaRequest;
import br.com.meveum.shared.exception.RegraNegocioException;
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
