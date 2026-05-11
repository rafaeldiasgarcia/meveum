package br.com.meveum.cardapio.complementos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.complementos.dto.ListarGrupoComplementoProdutoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.entity.ProdutoGrupoComplemento;
import br.com.meveum.cardapio.produtos.validator.service.ValidarProdutoExisteService;
import br.com.meveum.cardapio.repository.ProdutoGrupoComplementoRepository;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ListarGrupoComplementoProdutoServiceTest {

    @Mock
    private ValidarProdutoExisteService validarProdutoExisteService;
    @Mock
    private ProdutoGrupoComplementoRepository produtoGrupoComplementoRepository;
    @Mock
    private ComplementoMapper complementoMapper;
    @InjectMocks
    private ListarGrupoComplementoProdutoService service;

    @Test
    void deveListarGruposDoProduto() {
        var produtoId = UUID.randomUUID();
        var vinculo = new ProdutoGrupoComplemento();
        var response = new ListarGrupoComplementoProdutoResponse(UUID.randomUUID(), produtoId, UUID.randomUUID(), "Bebidas", 0, 2, 1, true);
        when(produtoGrupoComplementoRepository.findByProdutoIdOrderBySortOrderAsc(produtoId)).thenReturn(List.of(vinculo));
        when(complementoMapper.toListarGrupoComplementoProdutoResponse(vinculo)).thenReturn(response);

        var resultado = service.listar(produtoId);

        assertThat(resultado).containsExactly(response);
        verify(validarProdutoExisteService).validar(produtoId);
    }
}
