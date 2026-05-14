package br.com.meveum.cardapio.produtos.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.produtos.dto.DetalharProdutoResponse;
import br.com.meveum.cardapio.produtos.mapper.ProdutoMapper;
import br.com.meveum.cardapio.produtos.validator.service.ValidarProdutoExisteService;
import br.com.meveum.cardapio.repository.ProdutoRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ToggleDisponivelProdutoService {

    private final ValidarProdutoExisteService validarProdutoExisteService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final ProdutoRepository produtoRepository;
    private final ProdutoMapper produtoMapper;

    public DetalharProdutoResponse toggle(UUID produtoId) {
        var produto = validarProdutoExisteService.validar(produtoId);
        validarAcessoLojaService.validar(produto.getLoja().getId());
        produto.setActive(!Boolean.TRUE.equals(produto.getActive()));
        var produtoSalvo = produtoRepository.save(produto);
        return produtoMapper.toDetalharProdutoResponse(produtoSalvo);
    }
}
