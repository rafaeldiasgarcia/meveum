import { expect } from '@playwright/test';

export async function esperarStatus(response, statusEsperado) {
  expect(response.status()).toBe(statusEsperado);
  return response;
}

export async function lerJson(response) {
  return response.json();
}

export async function esperarStatusEJson(response, statusEsperado) {
  await esperarStatus(response, statusEsperado);
  return lerJson(response);
}

export function esperarCampos(body, camposEsperados) {
  for (const [campo, valorEsperado] of Object.entries(camposEsperados)) {
    expect(body[campo]).toBe(valorEsperado);
  }
}

export function esperarCamposPresentes(body, camposObrigatorios) {
  for (const campo of camposObrigatorios) {
    expect(body[campo]).not.toBeUndefined();
    expect(body[campo]).not.toBeNull();
  }
}

export function esperarListaComItem(lista, predicado) {
  expect(Array.isArray(lista)).toBeTruthy();
  expect(lista.some(predicado)).toBeTruthy();
}

export function esperarListaNaoVazia(lista) {
  expect(Array.isArray(lista)).toBeTruthy();
  expect(lista.length).toBeGreaterThan(0);
}

export async function esperarErro(response, statusEsperado) {
  const body = await esperarStatusEJson(response, statusEsperado);
  esperarCamposPresentes(body, ['mensagem', 'timestamp']);
  return body;
}
