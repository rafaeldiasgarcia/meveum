package br.com.meveum.crm.clientes.controller;

import br.com.meveum.crm.clientes.dto.AtualizarClienteRequest;
import br.com.meveum.crm.clientes.dto.AtualizarClienteResponse;
import br.com.meveum.crm.clientes.dto.AtualizarEnderecoClienteRequest;
import br.com.meveum.crm.clientes.dto.AtualizarEnderecoClienteResponse;
import br.com.meveum.crm.clientes.dto.CriarClienteRequest;
import br.com.meveum.crm.clientes.dto.CriarClienteResponse;
import br.com.meveum.crm.clientes.dto.CriarEnderecoClienteRequest;
import br.com.meveum.crm.clientes.dto.CriarEnderecoClienteResponse;
import br.com.meveum.crm.clientes.dto.DetalharClienteResponse;
import br.com.meveum.crm.clientes.dto.DetalharEnderecoClienteResponse;
import br.com.meveum.crm.clientes.dto.ListarClienteResponse;
import br.com.meveum.crm.clientes.dto.ListarEnderecoClienteResponse;
import br.com.meveum.crm.clientes.service.AtualizarClienteService;
import br.com.meveum.crm.clientes.service.AtualizarEnderecoClienteService;
import br.com.meveum.crm.clientes.service.CriarClienteService;
import br.com.meveum.crm.clientes.service.CriarEnderecoClienteService;
import br.com.meveum.crm.clientes.service.DetalharClienteService;
import br.com.meveum.crm.clientes.service.DetalharEnderecoClienteService;
import br.com.meveum.crm.clientes.service.ExcluirEnderecoClienteService;
import br.com.meveum.crm.clientes.service.ListarClienteService;
import br.com.meveum.crm.clientes.service.ListarEnderecoClienteService;
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
@RequestMapping("/clientes")
public class ClientesController {

    private final CriarClienteService criarClienteService;
    private final ListarClienteService listarClienteService;
    private final DetalharClienteService detalharClienteService;
    private final AtualizarClienteService atualizarClienteService;
    private final CriarEnderecoClienteService criarEnderecoClienteService;
    private final ListarEnderecoClienteService listarEnderecoClienteService;
    private final DetalharEnderecoClienteService detalharEnderecoClienteService;
    private final AtualizarEnderecoClienteService atualizarEnderecoClienteService;
    private final ExcluirEnderecoClienteService excluirEnderecoClienteService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CriarClienteResponse criar(@Valid @RequestBody CriarClienteRequest request) {
        return criarClienteService.criar(request);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ListarClienteResponse> listar(@RequestParam UUID lojaId) {
        return listarClienteService.listar(lojaId);
    }

    @GetMapping("/{clienteId}")
    @ResponseStatus(HttpStatus.OK)
    public DetalharClienteResponse detalhar(@PathVariable UUID clienteId) {
        return detalharClienteService.detalhar(clienteId);
    }

    @PutMapping("/{clienteId}")
    @ResponseStatus(HttpStatus.OK)
    public AtualizarClienteResponse atualizar(
        @PathVariable UUID clienteId,
        @Valid @RequestBody AtualizarClienteRequest request
    ) {
        return atualizarClienteService.atualizar(clienteId, request);
    }

    @PostMapping("/{clienteId}/enderecos")
    @ResponseStatus(HttpStatus.CREATED)
    public CriarEnderecoClienteResponse criarEndereco(
        @PathVariable UUID clienteId,
        @Valid @RequestBody CriarEnderecoClienteRequest request
    ) {
        return criarEnderecoClienteService.criar(clienteId, request);
    }

    @GetMapping("/{clienteId}/enderecos")
    @ResponseStatus(HttpStatus.OK)
    public List<ListarEnderecoClienteResponse> listarEnderecos(@PathVariable UUID clienteId) {
        return listarEnderecoClienteService.listar(clienteId);
    }

    @GetMapping("/{clienteId}/enderecos/{enderecoId}")
    @ResponseStatus(HttpStatus.OK)
    public DetalharEnderecoClienteResponse detalharEndereco(
        @PathVariable UUID clienteId,
        @PathVariable UUID enderecoId
    ) {
        return detalharEnderecoClienteService.detalhar(clienteId, enderecoId);
    }

    @PutMapping("/{clienteId}/enderecos/{enderecoId}")
    @ResponseStatus(HttpStatus.OK)
    public AtualizarEnderecoClienteResponse atualizarEndereco(
        @PathVariable UUID clienteId,
        @PathVariable UUID enderecoId,
        @Valid @RequestBody AtualizarEnderecoClienteRequest request
    ) {
        return atualizarEnderecoClienteService.atualizar(clienteId, enderecoId, request);
    }

    @DeleteMapping("/{clienteId}/enderecos/{enderecoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirEndereco(
        @PathVariable UUID clienteId,
        @PathVariable UUID enderecoId
    ) {
        excluirEnderecoClienteService.excluir(clienteId, enderecoId);
    }
}
