import { expect } from '@playwright/test';

export class SessaoBrowserService {
  constructor(page) {
    this.page = page;
  }

  async definirSessao(sessao) {
    await this.page.addInitScript(({ token, usuario }) => {
      window.localStorage.setItem('meveum_token', token);
      window.localStorage.setItem('meveum_usuario', JSON.stringify(usuario));
    }, sessao);
  }

  async validarSessao(sessao) {
    const sessaoAtual = await this.page.evaluate(() => ({
      token: window.localStorage.getItem('meveum_token'),
      usuario: JSON.parse(window.localStorage.getItem('meveum_usuario') ?? '{}'),
    }));

    expect(sessaoAtual.token).toBe(sessao.token);
    expect(sessaoAtual.usuario).toEqual(sessao.usuario);
  }

  async validarUsuarioPersistido(usuario) {
    const sessaoAtual = await this.page.evaluate(() => ({
      token: window.localStorage.getItem('meveum_token'),
      usuario: JSON.parse(window.localStorage.getItem('meveum_usuario') ?? '{}'),
    }));

    expect(sessaoAtual.token).not.toBeNull();
    expect(sessaoAtual.usuario).toEqual(usuario);
  }

  async validarSessaoLimpa() {
    const sessaoAtual = await this.page.evaluate(() => ({
      token: window.localStorage.getItem('meveum_token'),
      usuario: window.localStorage.getItem('meveum_usuario'),
    }));

    expect(sessaoAtual.token).toBeNull();
    expect(sessaoAtual.usuario).toBeNull();
  }
}
