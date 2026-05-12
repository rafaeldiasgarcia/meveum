package br.com.meveum.crm.clientes.service;

import br.com.meveum.crm.clientes.dto.ListarClienteResponse;
import br.com.meveum.crm.clientes.mapper.ClienteMapper;
import br.com.meveum.crm.repository.ClienteRepository;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListarClienteService {

    private final ValidarLojaExisteService validarLojaExisteService;
    private final ClienteRepository clienteRepository;
    private final ClienteMapper clienteMapper;

    public List<ListarClienteResponse> listar(UUID lojaId) {
        validarLojaExisteService.validar(lojaId);
        return clienteRepository.findByLojaIdOrderByNameAsc(lojaId)
            .stream()
            .map(clienteMapper::toListarClienteResponse)
            .toList();
    }
}
