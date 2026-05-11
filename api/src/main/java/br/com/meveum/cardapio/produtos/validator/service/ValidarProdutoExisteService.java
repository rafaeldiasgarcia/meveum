package br.com.meveum.cardapio.produtos.validator.service;

import br.com.meveum.cardapio.entity.Produto;
import br.com.meveum.cardapio.repository.ProdutoRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarProdutoExisteService {

    private final ProdutoRepository produtoRepository;

    public Produto validar(UUID produtoId) {
        return produtoRepository.findById(produtoId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Produto nao encontrado."));
    }

    public Produto validar(UUID produtoId, UUID lojaId) {
        return produtoRepository.findByIdAndLojaId(produtoId, lojaId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Produto nao encontrado."));
    }
}
