package br.com.meveum.cardapio.complementos.validator;

import br.com.meveum.cardapio.complementos.dto.AtualizarGrupoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.AtualizarOpcaoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.CriarGrupoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.CriarOpcaoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.VincularGrupoComplementoProdutoRequest;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;

@Component
public class ComplementoValidator {

    public void validarCriacaoGrupo(CriarGrupoComplementoRequest request) {
        validarNomeGrupo(request.nome());
        validarQuantidades(request.quantidadeMinima(), request.quantidadeMaxima());
        validarOrdem(request.ordem());
    }

    public void validarAtualizacaoGrupo(AtualizarGrupoComplementoRequest request) {
        validarNomeGrupo(request.nome());
        validarQuantidades(request.quantidadeMinima(), request.quantidadeMaxima());
        validarOrdem(request.ordem());
    }

    public void validarCriacaoOpcao(CriarOpcaoComplementoRequest request) {
        validarNomeOpcao(request.nome());
        validarPrecoAdicional(request.precoAdicional());
        validarOrdem(request.ordem());
    }

    public void validarAtualizacaoOpcao(AtualizarOpcaoComplementoRequest request) {
        validarNomeOpcao(request.nome());
        validarPrecoAdicional(request.precoAdicional());
        validarOrdem(request.ordem());
    }

    public void validarVinculoProdutoGrupo(VincularGrupoComplementoProdutoRequest request) {
        validarOrdem(request.ordem());
    }

    private void validarNomeGrupo(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new RegraNegocioException("Nome do grupo de complemento e obrigatorio.");
        }
    }

    private void validarNomeOpcao(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new RegraNegocioException("Nome da opcao de complemento e obrigatorio.");
        }
    }

    private void validarQuantidades(Integer quantidadeMinima, Integer quantidadeMaxima) {
        if (quantidadeMinima == null) {
            throw new RegraNegocioException("Quantidade minima do grupo de complemento e obrigatoria.");
        }

        if (quantidadeMaxima == null) {
            throw new RegraNegocioException("Quantidade maxima do grupo de complemento e obrigatoria.");
        }

        if (quantidadeMinima < 0) {
            throw new RegraNegocioException("Quantidade minima do grupo de complemento nao pode ser negativa.");
        }

        if (quantidadeMaxima < 1) {
            throw new RegraNegocioException("Quantidade maxima do grupo de complemento deve ser maior que zero.");
        }

        if (quantidadeMaxima < quantidadeMinima) {
            throw new RegraNegocioException("Quantidade maxima deve ser maior ou igual a quantidade minima.");
        }
    }

    private void validarPrecoAdicional(BigDecimal precoAdicional) {
        if (precoAdicional == null) {
            throw new RegraNegocioException("Preco adicional da opcao de complemento e obrigatorio.");
        }

        if (precoAdicional.compareTo(BigDecimal.ZERO) < 0) {
            throw new RegraNegocioException("Preco adicional da opcao de complemento nao pode ser negativo.");
        }
    }

    private void validarOrdem(Integer ordem) {
        if (ordem != null && ordem < 0) {
            throw new RegraNegocioException("Ordem do complemento nao pode ser negativa.");
        }
    }
}
