package br.com.meveum.cardapio.produtos.service;

import br.com.meveum.cardapio.produtos.dto.DetalharProdutoResponse;
import br.com.meveum.cardapio.produtos.mapper.ProdutoMapper;
import br.com.meveum.cardapio.produtos.validator.service.ValidarProdutoExisteService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DetalharProdutoService {

    private final ValidarProdutoExisteService validarProdutoExisteService;
    private final ProdutoMapper produtoMapper;

    public DetalharProdutoResponse detalhar(UUID produtoId) {
        var produto = validarProdutoExisteService.validar(produtoId);
        return produtoMapper.toDetalharProdutoResponse(produto);
    }
}
