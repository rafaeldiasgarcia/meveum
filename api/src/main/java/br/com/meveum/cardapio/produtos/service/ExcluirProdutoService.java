package br.com.meveum.cardapio.produtos.service;

import br.com.meveum.cardapio.produtos.validator.service.ValidarProdutoExisteService;
import br.com.meveum.cardapio.repository.ProdutoRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExcluirProdutoService {

    private final ValidarProdutoExisteService validarProdutoExisteService;
    private final ProdutoRepository produtoRepository;

    public void excluir(UUID produtoId) {
        var produto = validarProdutoExisteService.validar(produtoId);
        produto.setActive(false);
        produtoRepository.save(produto);
    }
}
