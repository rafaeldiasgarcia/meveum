import { test } from '../../../fixtures/api.fixture.js';

test('cria lista detalha atualiza e exclui area de entrega', { tag: ['@api', '@smoke', '@contrato'] }, async ({
  areasEntregaService,
  catalogoCompleto,
  usuarioLogado,
}) => {
  await areasEntregaService.validarListagem(usuarioLogado.lojaId, catalogoCompleto.areaEntrega);
  await areasEntregaService.validarDetalhe(
    catalogoCompleto.areaEntrega.id,
    catalogoCompleto.areaEntrega,
    usuarioLogado.token
  );
  await areasEntregaService.validarAtualizacao(
    catalogoCompleto.areaEntrega.id,
    catalogoCompleto.areaEntregaAtualizada,
    usuarioLogado.token
  );
  await areasEntregaService.validarExclusao(catalogoCompleto.areaEntrega.id, usuarioLogado.token);
});

test('rejeita area por raio sem raio informado', { tag: ['@api', '@negativo', '@regressao'] }, async ({
  areasEntregaService,
  catalogoCompleto,
  usuarioLogado,
}) => {
  await areasEntregaService.validarAreaInvalida(
    catalogoCompleto.areaEntregaInvalida,
    usuarioLogado.token
  );
});
