package br.com.meveum.integracao_whatsapp.service;

import br.com.meveum.integracao_whatsapp.dto.ObterMensagemWhatsappPedidoResponse;
import br.com.meveum.integracao_whatsapp.mapper.WhatsappMapper;
import br.com.meveum.integracao_whatsapp.validator.WhatsappValidator;
import br.com.meveum.pedidos.repository.PedidoRepository;
import br.com.meveum.pedidos.validator.service.ValidarPedidoExisteService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ObterMensagemWhatsappPedidoService {

    private final ValidarPedidoExisteService validarPedidoExisteService;
    private final MontarMensagemPedidoWhatsappService montarMensagemPedidoWhatsappService;
    private final PedidoRepository pedidoRepository;
    private final WhatsappValidator whatsappValidator;
    private final WhatsappMapper whatsappMapper;

    public ObterMensagemWhatsappPedidoResponse obter(UUID pedidoId) {
        var pedido = validarPedidoExisteService.validar(pedidoId);

        if (pedido.getWhatsappMessage() == null || pedido.getWhatsappMessage().isBlank()) {
            pedido.setWhatsappMessage(montarMensagemPedidoWhatsappService.montarStatusAtualizado(pedido));
            pedido = pedidoRepository.save(pedido);
        }

        whatsappValidator.validarPedidoParaEnvio(pedido);
        return whatsappMapper.toObterMensagemWhatsappPedidoResponse(pedido);
    }
}
