package br.com.meveum.cardapio.produtos.controller;

import br.com.meveum.cardapio.produtos.dto.AtualizarProdutoRequest;
import br.com.meveum.cardapio.produtos.dto.AtualizarProdutoResponse;
import br.com.meveum.cardapio.produtos.dto.CriarProdutoRequest;
import br.com.meveum.cardapio.produtos.dto.CriarProdutoResponse;
import br.com.meveum.cardapio.produtos.dto.DetalharProdutoResponse;
import br.com.meveum.cardapio.produtos.dto.ListarProdutoResponse;
import br.com.meveum.cardapio.produtos.service.AtualizarProdutoService;
import br.com.meveum.cardapio.produtos.service.CriarProdutoService;
import br.com.meveum.cardapio.produtos.service.DetalharProdutoService;
import br.com.meveum.cardapio.produtos.service.ExcluirProdutoService;
import br.com.meveum.cardapio.produtos.service.ListarProdutoService;
import br.com.meveum.cardapio.produtos.service.ToggleDisponivelProdutoService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/produtos")
public class ProdutosController {

    private final CriarProdutoService criarProdutoService;
    private final ListarProdutoService listarProdutoService;
    private final DetalharProdutoService detalharProdutoService;
    private final AtualizarProdutoService atualizarProdutoService;
    private final ExcluirProdutoService excluirProdutoService;
    private final ToggleDisponivelProdutoService toggleDisponivelProdutoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CriarProdutoResponse criar(@Valid @RequestBody CriarProdutoRequest request) {
        return criarProdutoService.criar(request);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ListarProdutoResponse> listar(
        @RequestParam UUID lojaId,
        @RequestParam(required = false) UUID categoriaId
    ) {
        return listarProdutoService.listar(lojaId, categoriaId);
    }

    @GetMapping("/{produtoId}")
    @ResponseStatus(HttpStatus.OK)
    public DetalharProdutoResponse detalhar(@PathVariable UUID produtoId) {
        return detalharProdutoService.detalhar(produtoId);
    }

    @PutMapping("/{produtoId}")
    @ResponseStatus(HttpStatus.OK)
    public AtualizarProdutoResponse atualizar(
        @PathVariable UUID produtoId,
        @Valid @RequestBody AtualizarProdutoRequest request
    ) {
        return atualizarProdutoService.atualizar(produtoId, request);
    }

    @PatchMapping("/{produtoId}/toggle-disponivel")
    @ResponseStatus(HttpStatus.OK)
    public DetalharProdutoResponse toggleDisponivel(@PathVariable UUID produtoId) {
        return toggleDisponivelProdutoService.toggle(produtoId);
    }

    @DeleteMapping("/{produtoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable UUID produtoId) {
        excluirProdutoService.excluir(produtoId);
    }
}
