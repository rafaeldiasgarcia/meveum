package br.com.meveum.pagamentos.formas.controller;

import br.com.meveum.pagamentos.formas.dto.AtualizarFormaPagamentoRequest;
import br.com.meveum.pagamentos.formas.dto.AtualizarFormaPagamentoResponse;
import br.com.meveum.pagamentos.formas.dto.CriarFormaPagamentoRequest;
import br.com.meveum.pagamentos.formas.dto.CriarFormaPagamentoResponse;
import br.com.meveum.pagamentos.formas.dto.DetalharFormaPagamentoResponse;
import br.com.meveum.pagamentos.formas.dto.ListarFormaPagamentoResponse;
import br.com.meveum.pagamentos.formas.service.AtualizarFormaPagamentoService;
import br.com.meveum.pagamentos.formas.service.CriarFormaPagamentoService;
import br.com.meveum.pagamentos.formas.service.DetalharFormaPagamentoService;
import br.com.meveum.pagamentos.formas.service.ExcluirFormaPagamentoService;
import br.com.meveum.pagamentos.formas.service.ListarFormaPagamentoService;
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
@RequestMapping("/pagamentos/formas")
public class FormasPagamentoController {

    private final CriarFormaPagamentoService criarFormaPagamentoService;
    private final ListarFormaPagamentoService listarFormaPagamentoService;
    private final DetalharFormaPagamentoService detalharFormaPagamentoService;
    private final AtualizarFormaPagamentoService atualizarFormaPagamentoService;
    private final ExcluirFormaPagamentoService excluirFormaPagamentoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CriarFormaPagamentoResponse criar(@Valid @RequestBody CriarFormaPagamentoRequest request) {
        return criarFormaPagamentoService.criar(request);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ListarFormaPagamentoResponse> listar(@RequestParam UUID lojaId) {
        return listarFormaPagamentoService.listar(lojaId);
    }

    @GetMapping("/{formaPagamentoId}")
    @ResponseStatus(HttpStatus.OK)
    public DetalharFormaPagamentoResponse detalhar(@PathVariable UUID formaPagamentoId) {
        return detalharFormaPagamentoService.detalhar(formaPagamentoId);
    }

    @PutMapping("/{formaPagamentoId}")
    @ResponseStatus(HttpStatus.OK)
    public AtualizarFormaPagamentoResponse atualizar(
        @PathVariable UUID formaPagamentoId,
        @Valid @RequestBody AtualizarFormaPagamentoRequest request
    ) {
        return atualizarFormaPagamentoService.atualizar(formaPagamentoId, request);
    }

    @DeleteMapping("/{formaPagamentoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable UUID formaPagamentoId) {
        excluirFormaPagamentoService.excluir(formaPagamentoId);
    }
}
