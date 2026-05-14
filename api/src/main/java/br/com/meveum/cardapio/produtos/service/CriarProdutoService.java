package br.com.meveum.cardapio.produtos.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.cardapio.produtos.dto.CriarProdutoRequest;
import br.com.meveum.cardapio.produtos.dto.CriarProdutoResponse;
import br.com.meveum.cardapio.produtos.mapper.ProdutoMapper;
import br.com.meveum.cardapio.produtos.validator.ProdutoValidator;
import br.com.meveum.cardapio.produtos.validator.service.ValidarCategoriaProdutoExisteService;
import br.com.meveum.cardapio.produtos.validator.service.ValidarLojaProdutoExisteService;
import br.com.meveum.cardapio.produtos.validator.service.ValidarNomeProdutoDisponivelService;
import br.com.meveum.cardapio.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CriarProdutoService {

    private final ProdutoValidator produtoValidator;
    private final ValidarLojaProdutoExisteService validarLojaProdutoExisteService;
    private final ValidarCategoriaProdutoExisteService validarCategoriaProdutoExisteService;
    private final ValidarNomeProdutoDisponivelService validarNomeProdutoDisponivelService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final ProdutoRepository produtoRepository;
    private final ProdutoMapper produtoMapper;

    public CriarProdutoResponse criar(CriarProdutoRequest request) {
        produtoValidator.validarCriacao(request);
        var loja = validarLojaProdutoExisteService.validar(request.lojaId());
        validarAcessoLojaService.validar(loja.getId());
        var categoria = validarCategoriaProdutoExisteService.validar(request.categoriaId(), request.lojaId());
        validarNomeProdutoDisponivelService.validarCriacao(request.lojaId(), request.nome());
        var produto = produtoMapper.toEntity(request);
        produto.setLoja(loja);
        produto.setCategoria(categoria);
        var produtoSalvo = produtoRepository.save(produto);
        return produtoMapper.toCriarProdutoResponse(produtoSalvo);
    }
}
