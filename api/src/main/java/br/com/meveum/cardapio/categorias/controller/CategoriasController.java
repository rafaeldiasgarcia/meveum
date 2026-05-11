package br.com.meveum.cardapio.categorias.controller;

import br.com.meveum.cardapio.categorias.dto.AtualizarCategoriaRequest;
import br.com.meveum.cardapio.categorias.dto.AtualizarCategoriaResponse;
import br.com.meveum.cardapio.categorias.dto.CriarCategoriaRequest;
import br.com.meveum.cardapio.categorias.dto.CriarCategoriaResponse;
import br.com.meveum.cardapio.categorias.dto.DetalharCategoriaResponse;
import br.com.meveum.cardapio.categorias.dto.ListarCategoriaResponse;
import br.com.meveum.cardapio.categorias.service.AtualizarCategoriaService;
import br.com.meveum.cardapio.categorias.service.CriarCategoriaService;
import br.com.meveum.cardapio.categorias.service.DetalharCategoriaService;
import br.com.meveum.cardapio.categorias.service.ExcluirCategoriaService;
import br.com.meveum.cardapio.categorias.service.ListarCategoriaService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
@RequestMapping("/categorias")
public class CategoriasController {

    private final CriarCategoriaService criarCategoriaService;
    private final ListarCategoriaService listarCategoriaService;
    private final DetalharCategoriaService detalharCategoriaService;
    private final AtualizarCategoriaService atualizarCategoriaService;
    private final ExcluirCategoriaService excluirCategoriaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CriarCategoriaResponse criar(@Valid @RequestBody CriarCategoriaRequest request) {
        return criarCategoriaService.criar(request);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ListarCategoriaResponse> listar(@RequestParam UUID lojaId) {
        return listarCategoriaService.listar(lojaId);
    }

    @GetMapping("/{categoriaId}")
    @ResponseStatus(HttpStatus.OK)
    public DetalharCategoriaResponse detalhar(@PathVariable UUID categoriaId) {
        return detalharCategoriaService.detalhar(categoriaId);
    }

    @PutMapping("/{categoriaId}")
    @ResponseStatus(HttpStatus.OK)
    public AtualizarCategoriaResponse atualizar(
        @PathVariable UUID categoriaId,
        @Valid @RequestBody AtualizarCategoriaRequest request
    ) {
        return atualizarCategoriaService.atualizar(categoriaId, request);
    }

    @DeleteMapping("/{categoriaId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable UUID categoriaId) {
        excluirCategoriaService.excluir(categoriaId);
    }
}
