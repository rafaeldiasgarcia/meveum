import { randomUUID } from 'node:crypto';
import { criarCadastroUsuario, criarRedefinicaoSenha } from './auth.data.js';

function sufixo() {
  return randomUUID().slice(0, 8);
}

function telefone(codigo) {
  return `1198${codigo.replace(/\D/g, '').padEnd(8, '8').slice(0, 8)}`;
}

export function criarCadastroE2E() {
  return criarCadastroUsuario('Usuario E2E');
}

export function criarNovaSenhaE2E(token) {
  return criarRedefinicaoSenha(token, 'meveum456');
}

export function criarProdutoAdminE2E(categoria) {
  const codigo = sufixo();

  return {
    nome: `Produto E2E ${codigo}`,
    descricao: `Produto criado por jornada E2E ${codigo}`,
    preco: '31.90',
    categoriaNome: categoria.nome,
  };
}

export function criarCheckoutPickupE2E() {
  const codigo = sufixo();

  return {
    tipo: 'PICKUP',
    tipoLabel: 'Retirada',
    nome: `Cliente Pickup ${codigo}`,
    telefone: telefone(codigo),
    observacao: `Observacao pickup ${codigo}`,
    pagamentoLabel: 'Pix',
    formaPagamento: 'PIX',
  };
}

export function criarCheckoutDeliveryE2E(areaEntrega) {
  const codigo = sufixo();

  return {
    tipo: 'DELIVERY',
    tipoLabel: 'Delivery',
    nome: `Cliente Delivery ${codigo}`,
    telefone: telefone(codigo),
    observacao: `Observacao delivery ${codigo}`,
    rua: `Rua E2E ${codigo}`,
    numero: '123',
    complemento: 'Apto 45',
    bairro: areaEntrega.bairro ?? areaEntrega.nome,
    cep: '01001-000',
    cidade: 'Sao Paulo',
    estado: 'SP',
    areaEntregaId: areaEntrega.id,
    areaEntregaNome: areaEntrega.nome,
    taxaEntrega: areaEntrega.taxa,
    pagamentoLabel: 'Pix',
    formaPagamento: 'PIX',
  };
}

export function criarConfiguracaoLojaE2E() {
  const codigo = sufixo();

  return {
    nome: `Loja E2E ${codigo}`,
    telefone: telefone(codigo),
    whatsapp: telefone(codigo),
    descricao: `Descricao E2E ${codigo}`,
    endereco: `Endereco E2E ${codigo}`,
    pixKey: `pix-${codigo}@meveum.test`,
    diaSemana: 'seg',
    abertura: '17:30',
    fechamento: '23:30',
  };
}
