import { expect } from '@playwright/test';
import {
  esperarCampos,
  esperarCamposPresentes,
  esperarErro,
  esperarStatusEJson,
} from './contract.service.js';

export class AuthService {
  constructor(request) {
    this.request = request;
  }

  async registrar(payload) {
    return this.request.post('/auth/registrar', { data: payload });
  }

  async login(payload) {
    return this.request.post('/auth/login', { data: payload });
  }

  async obterUsuario(token) {
    return this.request.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async validarRegistro(payload) {
    const body = await esperarStatusEJson(await this.registrar(payload), 201);
    esperarCamposPresentes(body, ['token', 'usuario']);
    esperarCampos(body.usuario, {
      email: payload.email,
      nome: payload.nome,
      role: 'OWNER',
    });
    expect(body.token.length).toBeGreaterThan(0);
    return body;
  }

  async validarLogin(payload, usuarioEsperado) {
    const body = await esperarStatusEJson(await this.login(payload), 200);
    esperarCamposPresentes(body, ['token', 'usuario']);
    esperarCampos(body.usuario, {
      email: usuarioEsperado.email,
      nome: usuarioEsperado.nome,
      role: usuarioEsperado.role,
    });
    expect(body.token.length).toBeGreaterThan(0);
    return body;
  }

  async validarLoginDoCadastro(cadastro) {
    return this.validarLogin(
      {
        email: cadastro.email,
        senha: cadastro.senha,
      },
      {
        email: cadastro.email,
        nome: cadastro.nome,
        role: 'OWNER',
      }
    );
  }

  async validarUsuarioAutenticado(token, usuarioEsperado) {
    const body = await esperarStatusEJson(await this.obterUsuario(token), 200);
    esperarCampos(body, {
      email: usuarioEsperado.email,
      nome: usuarioEsperado.nome,
      lojaId: usuarioEsperado.lojaId,
      role: usuarioEsperado.role,
    });
    return body;
  }

  async validarLoginInvalido(payload) {
    return esperarErro(await this.login(payload), 401);
  }

  async validarRegistroDuplicado(payload) {
    return esperarErro(await this.registrar(payload), 422);
  }

  async validarRegistroInvalido(payload) {
    return esperarErro(await this.registrar(payload), 422);
  }

  async validarBloqueioSemToken() {
    return esperarErro(await this.request.get('/auth/me'), 401);
  }
}
