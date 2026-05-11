package br.com.meveum.cardapio.complementos.service;

import br.com.meveum.cardapio.complementos.dto.VincularGrupoComplementoProdutoRequest;
import br.com.meveum.cardapio.complementos.dto.VincularGrupoComplementoProdutoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.complementos.validator.ComplementoValidator;
import br.com.meveum.cardapio.complementos.validator.service.ValidarGrupoComplementoExisteService;
import br.com.meveum.cardapio.complementos.validator.service.ValidarVinculoProdutoGrupoComplementoService;
import br.com.meveum.cardapio.produtos.validator.service.ValidarProdutoExisteService;
import br.com.meveum.cardapio.repository.ProdutoGrupoComplementoRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VincularGrupoComplementoProdutoService {

    private final ComplementoValidator complementoValidator;
    private final ValidarProdutoExisteService validarProdutoExisteService;
    private final ValidarGrupoComplementoExisteService validarGrupoComplementoExisteService;
    private final ValidarVinculoProdutoGrupoComplementoService validarVinculoProdutoGrupoComplementoService;
    private final ProdutoGrupoComplementoRepository produtoGrupoComplementoRepository;
    private final ComplementoMapper complementoMapper;

    public VincularGrupoComplementoProdutoResponse vincular(
        UUID produtoId,
        VincularGrupoComplementoProdutoRequest request
    ) {
        complementoValidator.validarVinculoProdutoGrupo(request);
        var produto = validarProdutoExisteService.validar(produtoId);
        var lojaId = produto.getLoja().getId();
        var grupoComplemento = validarGrupoComplementoExisteService.validarAtivo(request.grupoComplementoId(), lojaId);
        validarVinculoProdutoGrupoComplementoService.validarDisponivelParaCriacao(produtoId, request.grupoComplementoId());

        var vinculo = validarVinculoProdutoGrupoComplementoService.buscar(produtoId, request.grupoComplementoId())
            .orElseGet(() -> complementoMapper.toEntity(request));
        vinculo.setProduto(produto);
        vinculo.setGrupoComplemento(grupoComplemento);
        vinculo.setSortOrder(request.ordem() == null ? vinculo.getSortOrder() : request.ordem());
        vinculo.setActive(true);

        var vinculoSalvo = produtoGrupoComplementoRepository.save(vinculo);
        return complementoMapper.toVincularGrupoComplementoProdutoResponse(vinculoSalvo);
    }
}
