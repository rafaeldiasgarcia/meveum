package br.com.meveum.dashboard.service;

import br.com.meveum.auth.validator.service.ValidarAcessoLojaService;
import br.com.meveum.dashboard.dto.ClienteRecorrenteDashboardResponse;
import br.com.meveum.dashboard.mapper.DashboardMapper;
import br.com.meveum.dashboard.validator.DashboardValidator;
import br.com.meveum.lojas.validator.service.ValidarLojaExisteService;
import br.com.meveum.crm.repository.ClienteRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListarClientesRecorrentesDashboardService {

    private final DashboardValidator dashboardValidator;
    private final ValidarLojaExisteService validarLojaExisteService;
    private final ValidarAcessoLojaService validarAcessoLojaService;
    private final ClienteRepository clienteRepository;
    private final DashboardMapper dashboardMapper;

    public List<ClienteRecorrenteDashboardResponse> listar(UUID lojaId, Integer limite) {
        dashboardValidator.validarLimite(limite);
        validarLojaExisteService.validar(lojaId);
        validarAcessoLojaService.validar(lojaId);

        return clienteRepository.listarClientesRecorrentes(lojaId, PageRequest.of(0, limite))
            .stream()
            .map(dashboardMapper::toClienteRecorrenteDashboardResponse)
            .toList();
    }
}
