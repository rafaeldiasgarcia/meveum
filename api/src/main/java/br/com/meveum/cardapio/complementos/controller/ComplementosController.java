package br.com.meveum.cardapio.complementos.controller;

import br.com.meveum.cardapio.complementos.dto.AtualizarGrupoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.AtualizarGrupoComplementoResponse;
import br.com.meveum.cardapio.complementos.dto.AtualizarOpcaoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.AtualizarOpcaoComplementoResponse;
import br.com.meveum.cardapio.complementos.dto.CriarGrupoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.CriarGrupoComplementoResponse;
import br.com.meveum.cardapio.complementos.dto.CriarOpcaoComplementoRequest;
import br.com.meveum.cardapio.complementos.dto.CriarOpcaoComplementoResponse;
import br.com.meveum.cardapio.complementos.dto.DetalharGrupoComplementoResponse;
import br.com.meveum.cardapio.complementos.dto.DetalharOpcaoComplementoResponse;
import br.com.meveum.cardapio.complementos.dto.ListarGrupoComplementoProdutoResponse;
import br.com.meveum.cardapio.complementos.dto.ListarGrupoComplementoResponse;
import br.com.meveum.cardapio.complementos.dto.ListarOpcaoComplementoResponse;
import br.com.meveum.cardapio.complementos.dto.VincularGrupoComplementoProdutoRequest;
import br.com.meveum.cardapio.complementos.dto.VincularGrupoComplementoProdutoResponse;
import br.com.meveum.cardapio.complementos.service.AtualizarGrupoComplementoService;
import br.com.meveum.cardapio.complementos.service.AtualizarOpcaoComplementoService;
import br.com.meveum.cardapio.complementos.service.CriarGrupoComplementoService;
import br.com.meveum.cardapio.complementos.service.CriarOpcaoComplementoService;
import br.com.meveum.cardapio.complementos.service.DesvincularGrupoComplementoProdutoService;
import br.com.meveum.cardapio.complementos.service.DetalharGrupoComplementoService;
import br.com.meveum.cardapio.complementos.service.DetalharOpcaoComplementoService;
import br.com.meveum.cardapio.complementos.service.ExcluirGrupoComplementoService;
import br.com.meveum.cardapio.complementos.service.ExcluirOpcaoComplementoService;
import br.com.meveum.cardapio.complementos.service.ListarGrupoComplementoProdutoService;
import br.com.meveum.cardapio.complementos.service.ListarGrupoComplementoService;
import br.com.meveum.cardapio.complementos.service.ListarOpcaoComplementoService;
import br.com.meveum.cardapio.complementos.service.VincularGrupoComplementoProdutoService;
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
@RequestMapping("/complementos")
public class ComplementosController {

    private final CriarGrupoComplementoService criarGrupoComplementoService;
    private final ListarGrupoComplementoService listarGrupoComplementoService;
    private final DetalharGrupoComplementoService detalharGrupoComplementoService;
    private final AtualizarGrupoComplementoService atualizarGrupoComplementoService;
    private final ExcluirGrupoComplementoService excluirGrupoComplementoService;
    private final CriarOpcaoComplementoService criarOpcaoComplementoService;
    private final ListarOpcaoComplementoService listarOpcaoComplementoService;
    private final DetalharOpcaoComplementoService detalharOpcaoComplementoService;
    private final AtualizarOpcaoComplementoService atualizarOpcaoComplementoService;
    private final ExcluirOpcaoComplementoService excluirOpcaoComplementoService;
    private final VincularGrupoComplementoProdutoService vincularGrupoComplementoProdutoService;
    private final ListarGrupoComplementoProdutoService listarGrupoComplementoProdutoService;
    private final DesvincularGrupoComplementoProdutoService desvincularGrupoComplementoProdutoService;

    @PostMapping("/grupos")
    @ResponseStatus(HttpStatus.CREATED)
    public CriarGrupoComplementoResponse criarGrupo(@Valid @RequestBody CriarGrupoComplementoRequest request) {
        return criarGrupoComplementoService.criar(request);
    }

    @GetMapping("/grupos")
    @ResponseStatus(HttpStatus.OK)
    public List<ListarGrupoComplementoResponse> listarGrupos(@RequestParam UUID lojaId) {
        return listarGrupoComplementoService.listar(lojaId);
    }

    @GetMapping("/grupos/{grupoComplementoId}")
    @ResponseStatus(HttpStatus.OK)
    public DetalharGrupoComplementoResponse detalharGrupo(@PathVariable UUID grupoComplementoId) {
        return detalharGrupoComplementoService.detalhar(grupoComplementoId);
    }

    @PutMapping("/grupos/{grupoComplementoId}")
    @ResponseStatus(HttpStatus.OK)
    public AtualizarGrupoComplementoResponse atualizarGrupo(
        @PathVariable UUID grupoComplementoId,
        @Valid @RequestBody AtualizarGrupoComplementoRequest request
    ) {
        return atualizarGrupoComplementoService.atualizar(grupoComplementoId, request);
    }

    @DeleteMapping("/grupos/{grupoComplementoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirGrupo(@PathVariable UUID grupoComplementoId) {
        excluirGrupoComplementoService.excluir(grupoComplementoId);
    }

    @PostMapping("/opcoes")
    @ResponseStatus(HttpStatus.CREATED)
    public CriarOpcaoComplementoResponse criarOpcao(@Valid @RequestBody CriarOpcaoComplementoRequest request) {
        return criarOpcaoComplementoService.criar(request);
    }

    @GetMapping("/opcoes")
    @ResponseStatus(HttpStatus.OK)
    public List<ListarOpcaoComplementoResponse> listarOpcoes(@RequestParam UUID grupoComplementoId) {
        return listarOpcaoComplementoService.listar(grupoComplementoId);
    }

    @GetMapping("/opcoes/{opcaoComplementoId}")
    @ResponseStatus(HttpStatus.OK)
    public DetalharOpcaoComplementoResponse detalharOpcao(@PathVariable UUID opcaoComplementoId) {
        return detalharOpcaoComplementoService.detalhar(opcaoComplementoId);
    }

    @PutMapping("/opcoes/{opcaoComplementoId}")
    @ResponseStatus(HttpStatus.OK)
    public AtualizarOpcaoComplementoResponse atualizarOpcao(
        @PathVariable UUID opcaoComplementoId,
        @Valid @RequestBody AtualizarOpcaoComplementoRequest request
    ) {
        return atualizarOpcaoComplementoService.atualizar(opcaoComplementoId, request);
    }

    @DeleteMapping("/opcoes/{opcaoComplementoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirOpcao(@PathVariable UUID opcaoComplementoId) {
        excluirOpcaoComplementoService.excluir(opcaoComplementoId);
    }

    @PostMapping("/produtos/{produtoId}/grupos")
    @ResponseStatus(HttpStatus.CREATED)
    public VincularGrupoComplementoProdutoResponse vincularGrupoAoProduto(
        @PathVariable UUID produtoId,
        @Valid @RequestBody VincularGrupoComplementoProdutoRequest request
    ) {
        return vincularGrupoComplementoProdutoService.vincular(produtoId, request);
    }

    @GetMapping("/produtos/{produtoId}/grupos")
    @ResponseStatus(HttpStatus.OK)
    public List<ListarGrupoComplementoProdutoResponse> listarGruposDoProduto(@PathVariable UUID produtoId) {
        return listarGrupoComplementoProdutoService.listar(produtoId);
    }

    @DeleteMapping("/produtos/{produtoId}/grupos/{grupoComplementoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void desvincularGrupoDoProduto(@PathVariable UUID produtoId, @PathVariable UUID grupoComplementoId) {
        desvincularGrupoComplementoProdutoService.desvincular(produtoId, grupoComplementoId);
    }
}
