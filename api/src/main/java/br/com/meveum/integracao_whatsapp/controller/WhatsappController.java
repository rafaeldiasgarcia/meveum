package br.com.meveum.integracao_whatsapp.controller;

import br.com.meveum.integracao_whatsapp.dto.ObterMensagemWhatsappPedidoResponse;
import br.com.meveum.integracao_whatsapp.service.ObterMensagemWhatsappPedidoService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/integracoes/whatsapp")
public class WhatsappController {

    private final ObterMensagemWhatsappPedidoService obterMensagemWhatsappPedidoService;

    @GetMapping("/pedidos/{pedidoId}/mensagem")
    @ResponseStatus(HttpStatus.OK)
    public ObterMensagemWhatsappPedidoResponse obterMensagemPedido(@PathVariable UUID pedidoId) {
        return obterMensagemWhatsappPedidoService.obter(pedidoId);
    }
}
