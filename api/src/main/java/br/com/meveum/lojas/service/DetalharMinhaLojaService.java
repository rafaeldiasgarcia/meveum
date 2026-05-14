package br.com.meveum.lojas.service;

import br.com.meveum.auth.service.ObterUsuarioAutenticadoService;
import br.com.meveum.entrega.repository.AreaEntregaLojaRepository;
import br.com.meveum.lojas.dto.DetalharLojaResponse;
import br.com.meveum.lojas.mapper.LojaMapper;
import br.com.meveum.lojas.repository.PeriodoFuncionamentoLojaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DetalharMinhaLojaService {

    private final ObterUsuarioAutenticadoService obterUsuarioAutenticadoService;
    private final PeriodoFuncionamentoLojaRepository periodoFuncionamentoLojaRepository;
    private final AreaEntregaLojaRepository areaEntregaLojaRepository;
    private final LojaMapper lojaMapper;

    public DetalharLojaResponse detalhar() {
        var loja = obterUsuarioAutenticadoService.getUsuarioAutenticado().getLoja();
        var lojaId = loja.getId();
        var horarios = periodoFuncionamentoLojaRepository.findByLojaIdOrderByDayOfWeekAsc(lojaId);
        var taxasEntrega = areaEntregaLojaRepository.findByLojaIdOrderByNameAsc(lojaId);
        return lojaMapper.toDetalharLojaResponse(loja, horarios, taxasEntrega);
    }
}
