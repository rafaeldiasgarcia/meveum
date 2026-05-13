package br.com.meveum.pedidos.validator.service;

import br.com.meveum.cardapio.entity.OpcaoComplemento;
import br.com.meveum.cardapio.repository.OpcaoComplementoRepository;
import br.com.meveum.cardapio.repository.ProdutoGrupoComplementoRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarComplementoPedidoService {

    private final OpcaoComplementoRepository opcaoComplementoRepository;
    private final ProdutoGrupoComplementoRepository produtoGrupoComplementoRepository;

    public OpcaoComplemento validar(UUID lojaId, UUID produtoId, UUID opcaoComplementoId) {
        var opcao = opcaoComplementoRepository.findByIdAndLojaId(opcaoComplementoId, lojaId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Opcao de complemento do pedido nao encontrada."));

        if (!Boolean.TRUE.equals(opcao.getActive()) || !Boolean.TRUE.equals(opcao.getGrupoComplemento().getActive())) {
            throw new RegraNegocioException("Complemento do pedido nao esta ativo.");
        }

        produtoGrupoComplementoRepository.findByProdutoIdAndGrupoComplementoId(produtoId, opcao.getGrupoComplemento().getId())
            .orElseThrow(() -> new RegraNegocioException("Complemento nao pertence ao produto informado."));

        return opcao;
    }

    public void validarQuantidadesObrigatorias(UUID produtoId, Map<UUID, Integer> quantidadePorGrupo) {
        var vinculos = produtoGrupoComplementoRepository.findByProdutoIdOrderBySortOrderAsc(produtoId)
            .stream()
            .filter(vinculo -> Boolean.TRUE.equals(vinculo.getActive()))
            .filter(vinculo -> Boolean.TRUE.equals(vinculo.getGrupoComplemento().getActive()))
            .toList();

        for (var vinculo : vinculos) {
            var grupo = vinculo.getGrupoComplemento();
            var quantidade = quantidadePorGrupo.getOrDefault(grupo.getId(), 0);

            if (quantidade < grupo.getMinQuantity()) {
                throw new RegraNegocioException("Quantidade minima de complementos nao atingida.");
            }

            if (quantidade > grupo.getMaxQuantity()) {
                throw new RegraNegocioException("Quantidade maxima de complementos excedida.");
            }
        }
    }
}
