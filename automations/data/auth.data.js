import { randomUUID } from 'node:crypto';

function sufixo() {
  return randomUUID().slice(0, 8);
}

export function criarCadastroUsuario(prefixo = 'Usuario Automacao') {
  const codigo = sufixo();

  return {
    nome: `${prefixo} ${codigo}`,
    nomeLoja: `Loja ${codigo}`,
    telefone: `1199${codigo.replace(/\D/g, '').padEnd(8, '7').slice(0, 8)}`,
    email: `automacao.${codigo}@meveum.test`,
    senha: 'meveum123',
    confirmarSenha: 'meveum123',
  };
}

export function criarCredenciaisInvalidas(email) {
  return {
    email,
    senha: 'senha-incorreta',
  };
}

export function criarSolicitacaoRecuperacaoSenha(email) {
  return {
    email,
  };
}

export function criarRedefinicaoSenha(token, senha = 'meveum123') {
  return {
    token,
    senha,
    confirmarSenha: senha,
  };
}

export function criarCadastroDuplicado(cadastro) {
  return {
    ...cadastro,
    nome: `${cadastro.nome} Duplicado`,
    nomeLoja: `${cadastro.nomeLoja} Duplicada`,
  };
}

export const cadastroInvalido = Object.freeze({
  nome: '',
  nomeLoja: '',
  telefone: '',
  email: '',
  senha: '',
  confirmarSenha: '',
});

export const solicitacaoRecuperacaoSenhaInvalida = Object.freeze({
  email: '',
});

export const redefinicaoSenhaTokenInvalido = Object.freeze({
  token: 'token-invalido',
  senha: 'meveum123',
  confirmarSenha: 'meveum123',
});
