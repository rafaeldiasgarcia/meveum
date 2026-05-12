package br.com.meveum.entrega.areas.controller;

import br.com.meveum.entrega.areas.dto.AtualizarAreaEntregaRequest;
import br.com.meveum.entrega.areas.dto.AtualizarAreaEntregaResponse;
import br.com.meveum.entrega.areas.dto.CriarAreaEntregaRequest;
import br.com.meveum.entrega.areas.dto.CriarAreaEntregaResponse;
import br.com.meveum.entrega.areas.dto.DetalharAreaEntregaResponse;
import br.com.meveum.entrega.areas.dto.ListarAreaEntregaResponse;
import br.com.meveum.entrega.areas.service.AtualizarAreaEntregaService;
import br.com.meveum.entrega.areas.service.CriarAreaEntregaService;
import br.com.meveum.entrega.areas.service.DetalharAreaEntregaService;
import br.com.meveum.entrega.areas.service.ExcluirAreaEntregaService;
import br.com.meveum.entrega.areas.service.ListarAreaEntregaService;
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
@RequestMapping("/entrega/areas")
public class AreasEntregaController {

    private final CriarAreaEntregaService criarAreaEntregaService;
    private final ListarAreaEntregaService listarAreaEntregaService;
    private final DetalharAreaEntregaService detalharAreaEntregaService;
    private final AtualizarAreaEntregaService atualizarAreaEntregaService;
    private final ExcluirAreaEntregaService excluirAreaEntregaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CriarAreaEntregaResponse criar(@Valid @RequestBody CriarAreaEntregaRequest request) {
        return criarAreaEntregaService.criar(request);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ListarAreaEntregaResponse> listar(@RequestParam UUID lojaId) {
        return listarAreaEntregaService.listar(lojaId);
    }

    @GetMapping("/{areaEntregaId}")
    @ResponseStatus(HttpStatus.OK)
    public DetalharAreaEntregaResponse detalhar(@PathVariable UUID areaEntregaId) {
        return detalharAreaEntregaService.detalhar(areaEntregaId);
    }

    @PutMapping("/{areaEntregaId}")
    @ResponseStatus(HttpStatus.OK)
    public AtualizarAreaEntregaResponse atualizar(
        @PathVariable UUID areaEntregaId,
        @Valid @RequestBody AtualizarAreaEntregaRequest request
    ) {
        return atualizarAreaEntregaService.atualizar(areaEntregaId, request);
    }

    @DeleteMapping("/{areaEntregaId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable UUID areaEntregaId) {
        excluirAreaEntregaService.excluir(areaEntregaId);
    }
}
