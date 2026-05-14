package br.com.meveum.cardapio.produtos.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.produtos.dto.DetalharProdutoResponse;
import br.com.meveum.cardapio.produtos.mapper.ProdutoMapper;
import br.com.meveum.cardapio.produtos.validator.service.ValidarProdutoExisteService;
import br.com.meveum.cardapio.repository.ProdutoRepository;
import br.com.meveum.shared.exception.RegraNegocioException;
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
        if (!Boolean.TRUE.equals(produto.getActive())) {
            throw new RegraNegocioException("Produto inativo nao pode ter disponibilidade alterada.");
        }

        produto.setAvailable(!Boolean.TRUE.equals(produto.getAvailable()));
        var produtoSalvo = produtoRepository.save(produto);
        return produtoMapper.toDetalharProdutoResponse(produtoSalvo);
    }
}
