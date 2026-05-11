package br.com.meveum.cardapio.complementos.service;

import br.com.meveum.cardapio.complementos.dto.ListarGrupoComplementoProdutoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.produtos.validator.service.ValidarProdutoExisteService;
import br.com.meveum.cardapio.repository.ProdutoGrupoComplementoRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListarGrupoComplementoProdutoService {

    private final ValidarProdutoExisteService validarProdutoExisteService;
    private final ProdutoGrupoComplementoRepository produtoGrupoComplementoRepository;
    private final ComplementoMapper complementoMapper;

    public List<ListarGrupoComplementoProdutoResponse> listar(UUID produtoId) {
        validarProdutoExisteService.validar(produtoId);

        return produtoGrupoComplementoRepository.findByProdutoIdOrderBySortOrderAsc(produtoId)
            .stream()
            .map(complementoMapper::toListarGrupoComplementoProdutoResponse)
            .toList();
    }
}
