import { test } from '../../../fixtures/frontend.fixture.js';

test('renderiza sinais principais da landing', { tag: ['@frontend', '@smoke', '@contrato'] }, async ({
  landingPage,
}) => {
  await landingPage.abrir();
  await landingPage.validarBase();
});
