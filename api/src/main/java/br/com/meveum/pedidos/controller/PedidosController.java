package br.com.meveum.pedidos.controller;

import br.com.meveum.pedidos.dto.AtualizarStatusPedidoRequest;
import br.com.meveum.pedidos.dto.AtualizarStatusPedidoResponse;
import br.com.meveum.pedidos.dto.CriarPedidoRequest;
import br.com.meveum.pedidos.dto.CriarPedidoResponse;
import br.com.meveum.pedidos.dto.DetalharPedidoResponse;
import br.com.meveum.pedidos.dto.ListarPedidoResponse;
import br.com.meveum.pedidos.entity.enums.StatusPedido;
import br.com.meveum.pedidos.service.AtualizarStatusPedidoService;
import br.com.meveum.pedidos.service.CriarPedidoService;
import br.com.meveum.pedidos.service.DetalharPedidoService;
import br.com.meveum.pedidos.service.ListarPedidoService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/pedidos")
public class PedidosController {

    private final CriarPedidoService criarPedidoService;
    private final ListarPedidoService listarPedidoService;
    private final DetalharPedidoService detalharPedidoService;
    private final AtualizarStatusPedidoService atualizarStatusPedidoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CriarPedidoResponse criar(@Valid @RequestBody CriarPedidoRequest request) {
        return criarPedidoService.criar(request);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ListarPedidoResponse> listar(
        @RequestParam UUID lojaId,
        @RequestParam(required = false) StatusPedido status
    ) {
        return listarPedidoService.listar(lojaId, status);
    }

    @GetMapping("/{pedidoId}")
    @ResponseStatus(HttpStatus.OK)
    public DetalharPedidoResponse detalhar(@PathVariable UUID pedidoId) {
        return detalharPedidoService.detalhar(pedidoId);
    }

    @PatchMapping("/{pedidoId}/status")
    @ResponseStatus(HttpStatus.OK)
    public AtualizarStatusPedidoResponse atualizarStatus(
        @PathVariable UUID pedidoId,
        @Valid @RequestBody AtualizarStatusPedidoRequest request
    ) {
        return atualizarStatusPedidoService.atualizar(pedidoId, request);
    }
}
