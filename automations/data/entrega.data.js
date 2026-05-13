import { randomUUID } from 'node:crypto';

function codigo() {
  return randomUUID().slice(0, 8);
}

export function criarAreaEntregaBairroPayload(lojaId) {
  const id = codigo();

  return {
    lojaId,
    nome: `Area Bairro ${id}`,
    tipo: 'NEIGHBORHOOD',
    bairro: 'Centro',
    cepInicial: null,
    cepFinal: null,
    raioKm: null,
    taxa: 7.5,
    pedidoMinimo: 20,
    tempoEstimadoMinutos: 35,
  };
}

export function atualizarAreaEntregaBairroPayload(area) {
  return {
    nome: `${area.nome} Atualizada`,
    tipo: area.tipo,
    bairro: `${area.bairro} Atualizado`,
    cepInicial: area.cepInicial,
    cepFinal: area.cepFinal,
    raioKm: area.raioKm,
    taxa: 8.5,
    pedidoMinimo: 25,
    tempoEstimadoMinutos: 40,
    ativo: true,
  };
}

export function criarAreaEntregaRaioInvalida(lojaId) {
  return {
    lojaId,
    nome: 'Area Raio Invalida',
    tipo: 'RADIUS',
    bairro: null,
    cepInicial: null,
    cepFinal: null,
    raioKm: null,
    taxa: 5,
    pedidoMinimo: 0,
    tempoEstimadoMinutos: 20,
  };
}
