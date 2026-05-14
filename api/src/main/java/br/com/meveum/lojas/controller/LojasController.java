package br.com.meveum.lojas.controller;

import br.com.meveum.lojas.dto.AtualizarHorariosFuncionamentoRequest;
import br.com.meveum.lojas.dto.AtualizarLojaRequest;
import br.com.meveum.lojas.dto.AtualizarLojaResponse;
import br.com.meveum.lojas.dto.AtualizarPausaManualLojaRequest;
import br.com.meveum.lojas.dto.AtualizarPausaManualLojaResponse;
import br.com.meveum.lojas.dto.AtualizarStatusLojaRequest;
import br.com.meveum.lojas.dto.AtualizarStatusLojaResponse;
import br.com.meveum.lojas.dto.DetalharLojaResponse;
import br.com.meveum.lojas.dto.HorarioFuncionamentoResponse;
import br.com.meveum.lojas.service.AtualizarHorariosFuncionamentoService;
import br.com.meveum.lojas.service.AtualizarLojaService;
import br.com.meveum.lojas.service.AtualizarPausaManualLojaService;
import br.com.meveum.lojas.service.AtualizarStatusLojaService;
import br.com.meveum.lojas.service.DetalharMinhaLojaService;
import br.com.meveum.lojas.service.DetalharLojaPorSlugService;
import br.com.meveum.lojas.service.DetalharLojaService;
import br.com.meveum.lojas.service.ListarHorariosFuncionamentoService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/lojas")
public class LojasController {

    private final DetalharLojaService detalharLojaService;
    private final DetalharMinhaLojaService detalharMinhaLojaService;
    private final DetalharLojaPorSlugService detalharLojaPorSlugService;
    private final AtualizarLojaService atualizarLojaService;
    private final AtualizarPausaManualLojaService atualizarPausaManualLojaService;
    private final AtualizarStatusLojaService atualizarStatusLojaService;
    private final ListarHorariosFuncionamentoService listarHorariosFuncionamentoService;
    private final AtualizarHorariosFuncionamentoService atualizarHorariosFuncionamentoService;

    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public DetalharLojaResponse detalharMinhaLoja() {
        return detalharMinhaLojaService.detalhar();
    }

    @GetMapping("/{lojaId}")
    @ResponseStatus(HttpStatus.OK)
    public DetalharLojaResponse detalhar(@PathVariable UUID lojaId) {
        return detalharLojaService.detalhar(lojaId);
    }

    @GetMapping("/slug/{slug}")
    @ResponseStatus(HttpStatus.OK)
    public DetalharLojaResponse detalharPorSlug(@PathVariable String slug) {
        return detalharLojaPorSlugService.detalhar(slug);
    }

    @PutMapping("/{lojaId}")
    @ResponseStatus(HttpStatus.OK)
    public AtualizarLojaResponse atualizar(
        @PathVariable UUID lojaId,
        @Valid @RequestBody AtualizarLojaRequest request
    ) {
        return atualizarLojaService.atualizar(lojaId, request);
    }

    @PatchMapping("/{lojaId}/pausa-manual")
    @ResponseStatus(HttpStatus.OK)
    public AtualizarPausaManualLojaResponse atualizarPausaManual(
        @PathVariable UUID lojaId,
        @Valid @RequestBody AtualizarPausaManualLojaRequest request
    ) {
        return atualizarPausaManualLojaService.atualizar(lojaId, request);
    }

    @PatchMapping("/{lojaId}/status")
    @ResponseStatus(HttpStatus.OK)
    public AtualizarStatusLojaResponse atualizarStatus(
        @PathVariable UUID lojaId,
        @Valid @RequestBody AtualizarStatusLojaRequest request
    ) {
        return atualizarStatusLojaService.atualizar(lojaId, request);
    }

    @GetMapping("/{lojaId}/horarios")
    @ResponseStatus(HttpStatus.OK)
    public List<HorarioFuncionamentoResponse> listarHorarios(@PathVariable UUID lojaId) {
        return listarHorariosFuncionamentoService.listar(lojaId);
    }

    @PutMapping("/{lojaId}/horarios")
    @ResponseStatus(HttpStatus.OK)
    public List<HorarioFuncionamentoResponse> atualizarHorarios(
        @PathVariable UUID lojaId,
        @Valid @RequestBody AtualizarHorariosFuncionamentoRequest request
    ) {
        return atualizarHorariosFuncionamentoService.atualizar(lojaId, request);
    }
}
