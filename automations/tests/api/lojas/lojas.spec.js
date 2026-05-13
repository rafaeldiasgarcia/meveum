import { test } from '../../../fixtures/api.fixture.js';

test('consulta a loja privada e publica do usuario criado', { tag: ['@api', '@smoke', '@contrato'] }, async ({
  lojasService,
  lojaAtualizavel,
  usuarioLogado,
}) => {
  await lojasService.validarDetalhesPrivado(
    usuarioLogado.lojaId,
    usuarioLogado.token,
    lojaAtualizavel.loja
  );
  await lojasService.validarDetalhesPublicos(lojaAtualizavel.loja.slug, lojaAtualizavel.loja);
});

test('atualiza dados, pausa manual e status operacional da loja', { tag: ['@api', '@regressao', '@contrato'] }, async ({
  lojasService,
  lojaAtualizavel,
  usuarioLogado,
}) => {
  await lojasService.validarAtualizacao(
    usuarioLogado.lojaId,
    lojaAtualizavel.atualizar,
    usuarioLogado.token
  );
  await lojasService.validarPausaManual(
    usuarioLogado.lojaId,
    lojaAtualizavel.pausar,
    usuarioLogado.token
  );
  await lojasService.validarStatus(
    usuarioLogado.lojaId,
    lojaAtualizavel.inativar,
    usuarioLogado.token
  );
});

test('bloqueia detalhe privado de loja sem autenticacao', { tag: ['@api', '@negativo', '@contrato'] }, async ({
  lojasService,
  usuarioLogado,
}) => {
  await lojasService.validarBloqueioSemToken(usuarioLogado.lojaId);
});

test('retorna nao encontrado para slug publico inexistente', { tag: ['@api', '@negativo', '@contrato'] }, async ({
  lojasService,
}) => {
  await lojasService.validarSlugInexistente('slug-publico-inexistente-automacao');
});
