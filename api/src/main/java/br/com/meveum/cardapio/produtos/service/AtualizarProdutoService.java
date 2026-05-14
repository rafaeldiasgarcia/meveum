package br.com.meveum.cardapio.produtos.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.produtos.dto.AtualizarProdutoRequest;
import br.com.meveum.cardapio.produtos.dto.AtualizarProdutoResponse;
import br.com.meveum.cardapio.produtos.mapper.ProdutoMapper;
import br.com.meveum.cardapio.produtos.validator.ProdutoValidator;
import br.com.meveum.cardapio.produtos.validator.service.ValidarCategoriaProdutoExisteService;
import br.com.meveum.cardapio.produtos.validator.service.ValidarNomeProdutoDisponivelService;
import br.com.meveum.cardapio.produtos.validator.service.ValidarProdutoExisteService;
import br.com.meveum.cardapio.repository.ProdutoRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AtualizarProdutoService {

    private final ProdutoValidator produtoValidator;
    private final ValidarProdutoExisteService validarProdutoExisteService;
    private final ValidarCategoriaProdutoExisteService validarCategoriaProdutoExisteService;
    private final ValidarNomeProdutoDisponivelService validarNomeProdutoDisponivelService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final ProdutoRepository produtoRepository;
    private final ProdutoMapper produtoMapper;

    public AtualizarProdutoResponse atualizar(UUID produtoId, AtualizarProdutoRequest request) {
        produtoValidator.validarAtualizacao(request);
        var produto = validarProdutoExisteService.validar(produtoId);
        var lojaId = produto.getLoja().getId();
        validarAcessoLojaService.validar(lojaId);
        var categoria = validarCategoriaProdutoExisteService.validar(request.categoriaId(), lojaId);
        validarNomeProdutoDisponivelService.validarAtualizacao(lojaId, produtoId, request.nome());
        produtoMapper.toEntity(request, produto);
        produto.setCategoria(categoria);
        var produtoSalvo = produtoRepository.save(produto);
        return produtoMapper.toAtualizarProdutoResponse(produtoSalvo);
    }
}
