package br.com.meveum.cardapio.complementos.service;

import br.com.meveum.cardapio.complementos.dto.ListarGrupoComplementoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.complementos.validator.service.ValidarLojaComplementoExisteService;
import br.com.meveum.cardapio.repository.GrupoComplementoRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListarGrupoComplementoService {

    private final ValidarLojaComplementoExisteService validarLojaComplementoExisteService;
    private final GrupoComplementoRepository grupoComplementoRepository;
    private final ComplementoMapper complementoMapper;

    public List<ListarGrupoComplementoResponse> listar(UUID lojaId) {
        validarLojaComplementoExisteService.validar(lojaId);

        return grupoComplementoRepository.findByLojaIdOrderBySortOrderAsc(lojaId)
            .stream()
            .map(complementoMapper::toListarGrupoComplementoResponse)
            .toList();
    }
}
