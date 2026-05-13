import { expect } from '@playwright/test';

export class LandingPage {
  constructor(page) {
    this.page = page;
    this.ctaHeader = page.getByTestId('landing-header-cta');
    this.botaoMenu = page.getByTestId('landing-menu-button');
    this.menuMobile = page.getByTestId('landing-mobile-menu');
    this.carouselPlanos = page.getByTestId('precos-planos-carousel');
  }

  async abrir() {
    await this.page.goto('/');
    await expect(this.ctaHeader).toBeVisible();
  }

  async validarBase() {
    await expect(this.ctaHeader).toBeVisible();
    await expect(this.carouselPlanos).toBeVisible();
  }

  async abrirMenuMobile() {
    await this.botaoMenu.click();
  }

  async validarMenuMobile() {
    await expect(this.menuMobile).toBeVisible();
  }
}
