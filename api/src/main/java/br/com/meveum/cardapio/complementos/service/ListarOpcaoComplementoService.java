package br.com.meveum.cardapio.complementos.service;

import br.com.meveum.cardapio.complementos.dto.ListarOpcaoComplementoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.complementos.validator.service.ValidarGrupoComplementoExisteService;
import br.com.meveum.cardapio.repository.OpcaoComplementoRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListarOpcaoComplementoService {

    private final ValidarGrupoComplementoExisteService validarGrupoComplementoExisteService;
    private final OpcaoComplementoRepository opcaoComplementoRepository;
    private final ComplementoMapper complementoMapper;

    public List<ListarOpcaoComplementoResponse> listar(UUID grupoComplementoId) {
        validarGrupoComplementoExisteService.validar(grupoComplementoId);

        return opcaoComplementoRepository.findByGrupoComplementoIdOrderBySortOrderAsc(grupoComplementoId)
            .stream()
            .map(complementoMapper::toListarOpcaoComplementoResponse)
            .toList();
    }
}
