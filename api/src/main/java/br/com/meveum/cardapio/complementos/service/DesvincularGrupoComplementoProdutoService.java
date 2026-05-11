package br.com.meveum.cardapio.complementos.service;

import br.com.meveum.cardapio.complementos.validator.service.ValidarVinculoProdutoGrupoComplementoService;
import br.com.meveum.cardapio.produtos.validator.service.ValidarProdutoExisteService;
import br.com.meveum.cardapio.repository.ProdutoGrupoComplementoRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DesvincularGrupoComplementoProdutoService {

    private final ValidarProdutoExisteService validarProdutoExisteService;
    private final ValidarVinculoProdutoGrupoComplementoService validarVinculoProdutoGrupoComplementoService;
    private final ProdutoGrupoComplementoRepository produtoGrupoComplementoRepository;

    public void desvincular(UUID produtoId, UUID grupoComplementoId) {
        validarProdutoExisteService.validar(produtoId);
        var vinculo = validarVinculoProdutoGrupoComplementoService.validarExiste(produtoId, grupoComplementoId);
        vinculo.setActive(false);
        produtoGrupoComplementoRepository.save(vinculo);
    }
}
