package br.com.meveum.cardapio.complementos.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.meveum.cardapio.complementos.dto.VincularGrupoComplementoProdutoRequest;
import br.com.meveum.cardapio.complementos.dto.VincularGrupoComplementoProdutoResponse;
import br.com.meveum.cardapio.complementos.mapper.ComplementoMapper;
import br.com.meveum.cardapio.complementos.validator.ComplementoValidator;
import br.com.meveum.cardapio.complementos.validator.service.ValidarGrupoComplementoExisteService;
import br.com.meveum.cardapio.complementos.validator.service.ValidarVinculoProdutoGrupoComplementoService;
import br.com.meveum.cardapio.entity.GrupoComplemento;
import br.com.meveum.cardapio.entity.Produto;
import br.com.meveum.cardapio.entity.ProdutoGrupoComplemento;
import br.com.meveum.cardapio.produtos.validator.service.ValidarProdutoExisteService;
import br.com.meveum.cardapio.repository.ProdutoGrupoComplementoRepository;
import br.com.meveum.lojas.entity.Loja;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class VincularGrupoComplementoProdutoServiceTest {

    @Mock
    private ComplementoValidator complementoValidator;
    @Mock
    private ValidarProdutoExisteService validarProdutoExisteService;
    @Mock
    private ValidarGrupoComplementoExisteService validarGrupoComplementoExisteService;
    @Mock
    private ValidarVinculoProdutoGrupoComplementoService validarVinculoProdutoGrupoComplementoService;
    @Mock
    private ProdutoGrupoComplementoRepository produtoGrupoComplementoRepository;
    @Mock
    private ComplementoMapper complementoMapper;
    @InjectMocks
    private VincularGrupoComplementoProdutoService service;

    @Test
    void deveVincularGrupoAoProduto() {
        var produtoId = UUID.randomUUID();
        var lojaId = UUID.randomUUID();
        var grupoId = UUID.randomUUID();
        var request = new VincularGrupoComplementoProdutoRequest(grupoId, 2);
        var loja = new Loja();
        loja.setId(lojaId);
        var produto = new Produto();
        produto.setLoja(loja);
        var grupo = new GrupoComplemento();
        var vinculo = new ProdutoGrupoComplemento();
        var response = new VincularGrupoComplementoProdutoResponse(UUID.randomUUID(), produtoId, grupoId, "Bebidas", 2, true);
        when(validarProdutoExisteService.validar(produtoId)).thenReturn(produto);
        when(validarGrupoComplementoExisteService.validarAtivo(grupoId, lojaId)).thenReturn(grupo);
        when(validarVinculoProdutoGrupoComplementoService.buscar(produtoId, grupoId)).thenReturn(Optional.empty());
        when(complementoMapper.toEntity(request)).thenReturn(vinculo);
        when(produtoGrupoComplementoRepository.save(vinculo)).thenReturn(vinculo);
        when(complementoMapper.toVincularGrupoComplementoProdutoResponse(vinculo)).thenReturn(response);

        var resultado = service.vincular(produtoId, request);

        assertThat(resultado).isEqualTo(response);
        assertThat(vinculo.getProduto()).isEqualTo(produto);
        assertThat(vinculo.getGrupoComplemento()).isEqualTo(grupo);
        assertThat(vinculo.getActive()).isTrue();
        verify(complementoValidator).validarVinculoProdutoGrupo(request);
        verify(validarVinculoProdutoGrupoComplementoService).validarDisponivelParaCriacao(produtoId, grupoId);
    }
}
