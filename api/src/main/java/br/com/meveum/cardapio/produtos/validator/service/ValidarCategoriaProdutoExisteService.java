package br.com.meveum.cardapio.produtos.validator.service;

import br.com.meveum.cardapio.entity.Categoria;
import br.com.meveum.cardapio.repository.CategoriaRepository;
import br.com.meveum.shared.exception.RecursoNaoEncontradoException;
import br.com.meveum.shared.exception.RegraNegocioException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidarCategoriaProdutoExisteService {

    private final CategoriaRepository categoriaRepository;

    public Categoria validar(UUID categoriaId, UUID lojaId) {
        var categoria = categoriaRepository.findByIdAndLojaId(categoriaId, lojaId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria nao encontrada."));

        if (!Boolean.TRUE.equals(categoria.getActive())) {
            throw new RegraNegocioException("Categoria precisa estar ativa para receber produtos.");
        }

        return categoria;
    }
}
