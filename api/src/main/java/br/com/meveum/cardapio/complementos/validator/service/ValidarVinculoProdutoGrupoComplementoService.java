package br.com.meveum.cardapio.complementos.validator.service;

import br.com.meveum.cardapio.entity.ProdutoGrupoComplemento;
import br.com.meveum.cardapio.repository.ProdutoGrupoComplementoRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarVinculoProdutoGrupoComplementoService {

    private final ProdutoGrupoComplementoRepository produtoGrupoComplementoRepository;

    public Optional<ProdutoGrupoComplemento> buscar(UUID produtoId, UUID grupoComplementoId) {
        return produtoGrupoComplementoRepository.findByProdutoIdAndGrupoComplementoId(produtoId, grupoComplementoId);
    }

    public void validarDisponivelParaCriacao(UUID produtoId, UUID grupoComplementoId) {
        buscar(produtoId, grupoComplementoId)
            .filter(ProdutoGrupoComplemento::getActive)
            .ifPresent(vinculo -> {
                throw new RegraNegocioException("Produto ja possui esse grupo de complemento vinculado.");
            });
    }

    public ProdutoGrupoComplemento validarExiste(UUID produtoId, UUID grupoComplementoId) {
        return buscar(produtoId, grupoComplementoId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Vinculo de produto e grupo de complemento nao encontrado."));
    }
}
