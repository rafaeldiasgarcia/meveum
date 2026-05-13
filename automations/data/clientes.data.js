import { randomUUID } from 'node:crypto';

function codigo() {
  return randomUUID().slice(0, 8);
}

export function criarClientePayload(lojaId) {
  const id = codigo();

  return {
    lojaId,
    nome: `Cliente ${id}`,
    telefone: `1198${id.replace(/\D/g, '').padEnd(8, '6').slice(0, 8)}`,
  };
}

export function atualizarClientePayload(cliente) {
  return {
    nome: `${cliente.nome} Atualizado`,
    telefone: cliente.telefone.replace(/^1198/, '1197'),
  };
}

export function criarEnderecoPayload() {
  const id = codigo();

  return {
    rotulo: `Endereco ${id}`,
    rua: `Rua Automacao ${id}`,
    numero: '123',
    complemento: 'Sala 4',
    bairro: 'Centro',
    cidade: 'Sao Paulo',
    estado: 'SP',
    cep: '01001000',
    referencia: 'Portaria principal',
    latitude: -23.55052,
    longitude: -46.633308,
  };
}

export function atualizarEnderecoPayload(endereco) {
  return {
    rotulo: `${endereco.rotulo} Atualizado`,
    rua: `${endereco.rua} Atualizada`,
    numero: '456',
    complemento: 'Fundos',
    bairro: 'Bela Vista',
    cidade: endereco.cidade,
    estado: endereco.estado,
    cep: endereco.cep,
    referencia: 'Ao lado da farmacia',
    latitude: endereco.latitude,
    longitude: endereco.longitude,
  };
}

export function criarEnderecoInvalido() {
  return {
    rotulo: 'Endereco Invalido',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: 'S',
    cep: '',
    referencia: '',
    latitude: 999,
    longitude: 999,
  };
}
