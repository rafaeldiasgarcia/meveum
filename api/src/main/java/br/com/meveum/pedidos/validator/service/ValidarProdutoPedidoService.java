package br.com.meveum.pedidos.validator.service;

import br.com.meveum.cardapio.entity.Produto;
import br.com.meveum.cardapio.repository.ProdutoRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarProdutoPedidoService {

    private final ProdutoRepository produtoRepository;

    public Produto validar(UUID lojaId, UUID produtoId) {
        var produto = produtoRepository.findByIdAndLojaId(produtoId, lojaId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Produto do pedido nao encontrado."));

        if (!Boolean.TRUE.equals(produto.getActive())) {
            throw new RegraNegocioException("Produto do pedido nao esta ativo.");
        }

        return produto;
    }
}
