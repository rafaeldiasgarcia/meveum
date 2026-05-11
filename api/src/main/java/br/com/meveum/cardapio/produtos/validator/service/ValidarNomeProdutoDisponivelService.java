package br.com.meveum.cardapio.produtos.validator.service;

import br.com.meveum.cardapio.repository.ProdutoRepository;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarNomeProdutoDisponivelService {

    private final ProdutoRepository produtoRepository;

    public void validarCriacao(UUID lojaId, String nome) {
        if (produtoRepository.existsByLojaIdAndNameIgnoreCase(lojaId, nome)) {
            throw new RegraNegocioException("Ja existe um produto com esse nome.");
        }
    }

    public void validarAtualizacao(UUID lojaId, UUID produtoId, String nome) {
        if (produtoRepository.existsByLojaIdAndNameIgnoreCaseAndIdNot(lojaId, nome, produtoId)) {
            throw new RegraNegocioException("Ja existe um produto com esse nome.");
        }
    }
}
