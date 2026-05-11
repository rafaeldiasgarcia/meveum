package br.com.meveum.cardapio.complementos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.complementos.validator.service.ValidarVinculoProdutoGrupoComplementoService;
import br.com.meveum.cardapio.entity.ProdutoGrupoComplemento;
import br.com.meveum.cardapio.produtos.validator.service.ValidarProdutoExisteService;
import br.com.meveum.cardapio.repository.ProdutoGrupoComplementoRepository;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DesvincularGrupoComplementoProdutoServiceTest {

    @Mock
    private ValidarProdutoExisteService validarProdutoExisteService;
    @Mock
    private ValidarVinculoProdutoGrupoComplementoService validarVinculoProdutoGrupoComplementoService;
    @Mock
    private ProdutoGrupoComplementoRepository produtoGrupoComplementoRepository;
    @InjectMocks
    private DesvincularGrupoComplementoProdutoService service;

    @Test
    void deveInativarVinculoDoProduto() {
        var produtoId = UUID.randomUUID();
        var grupoId = UUID.randomUUID();
        var vinculo = new ProdutoGrupoComplemento();
        vinculo.setActive(true);
        when(validarVinculoProdutoGrupoComplementoService.validarExiste(produtoId, grupoId)).thenReturn(vinculo);

        service.desvincular(produtoId, grupoId);

        assertThat(vinculo.getActive()).isFalse();
        verify(validarProdutoExisteService).validar(produtoId);
        verify(produtoGrupoComplementoRepository).save(vinculo);
    }
}
