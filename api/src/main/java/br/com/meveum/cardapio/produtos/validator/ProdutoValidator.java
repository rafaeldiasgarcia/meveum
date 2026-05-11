package br.com.meveum.cardapio.produtos.validator;

import br.com.meveum.cardapio.produtos.dto.AtualizarProdutoRequest;
import br.com.meveum.cardapio.produtos.dto.CriarProdutoRequest;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;

@Component
public class ProdutoValidator {

    public void validarCriacao(CriarProdutoRequest request) {
        validarNome(request.nome());
        validarPreco(request.preco());
        validarOrdem(request.ordem());
    }

    public void validarAtualizacao(AtualizarProdutoRequest request) {
        validarNome(request.nome());
        validarPreco(request.preco());
        validarOrdem(request.ordem());
    }

    private void validarNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new RegraNegocioException("Nome do produto e obrigatorio.");
        }
    }

    private void validarPreco(BigDecimal preco) {
        if (preco == null) {
            throw new RegraNegocioException("Preco do produto e obrigatorio.");
        }

        if (preco.signum() < 0) {
            throw new RegraNegocioException("Preco do produto nao pode ser negativo.");
        }
    }

    private void validarOrdem(Integer ordem) {
        if (ordem != null && ordem < 0) {
            throw new RegraNegocioException("Ordem do produto nao pode ser negativa.");
        }
    }
}
