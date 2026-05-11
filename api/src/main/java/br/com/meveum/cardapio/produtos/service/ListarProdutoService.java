package br.com.meveum.cardapio.produtos.service;

import br.com.meveum.cardapio.produtos.dto.ListarProdutoResponse;
import br.com.meveum.cardapio.produtos.mapper.ProdutoMapper;
import br.com.meveum.cardapio.produtos.validator.service.ValidarCategoriaProdutoExisteService;
import br.com.meveum.cardapio.produtos.validator.service.ValidarLojaProdutoExisteService;
import br.com.meveum.cardapio.repository.ProdutoRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListarProdutoService {

    private final ValidarLojaProdutoExisteService validarLojaProdutoExisteService;
    private final ValidarCategoriaProdutoExisteService validarCategoriaProdutoExisteService;
    private final ProdutoRepository produtoRepository;
    private final ProdutoMapper produtoMapper;

    public List<ListarProdutoResponse> listar(UUID lojaId, UUID categoriaId) {
        validarLojaProdutoExisteService.validar(lojaId);

        if (categoriaId != null) {
            validarCategoriaProdutoExisteService.validar(categoriaId, lojaId);
            return produtoRepository.findByLojaIdAndCategoriaIdOrderBySortOrderAsc(lojaId, categoriaId)
                .stream()
                .map(produtoMapper::toListarProdutoResponse)
                .toList();
        }

        return produtoRepository.findByLojaIdOrderBySortOrderAsc(lojaId)
            .stream()
            .map(produtoMapper::toListarProdutoResponse)
            .toList();
    }
}
