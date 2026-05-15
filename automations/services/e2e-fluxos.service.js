export class E2EFluxosService {
  constructor({
    cardapioAdminPage,
    cardapioPublicoPage,
    clientesPage,
    configuracoesPage,
    dashboardPage,
    dashboardResumoPage,
    dbService,
    forgotPasswordPage,
    loginPage,
    pedidosPage,
    registerPage,
    resetPasswordPage,
    sessaoBrowserService,
  }) {
    this.cardapioAdminPage = cardapioAdminPage;
    this.cardapioPublicoPage = cardapioPublicoPage;
    this.clientesPage = clientesPage;
    this.configuracoesPage = configuracoesPage;
    this.dashboardPage = dashboardPage;
    this.dashboardResumoPage = dashboardResumoPage;
    this.dbService = dbService;
    this.forgotPasswordPage = forgotPasswordPage;
    this.loginPage = loginPage;
    this.pedidosPage = pedidosPage;
    this.registerPage = registerPage;
    this.resetPasswordPage = resetPasswordPage;
    this.sessaoBrowserService = sessaoBrowserService;
  }

  async validarCadastroLoginLogout(cadastro) {
    await this.registerPage.abrir();
    await this.registerPage.cadastrar(cadastro);
    await this.dashboardPage.validarUsuarioExibido(cadastro.nome);
    await this.dbService.validarUsuarioELojaCriados(cadastro);
    await this.dashboardPage.sair();
    await this.loginPage.abrir();
    await this.loginPage.autenticarCadastro(cadastro);
    await this.dashboardPage.validarUsuarioExibido(cadastro.nome);
  }

  async validarRecuperacaoSenha(usuarioLogado, redefinicaoSenhaE2E) {
    await this.forgotPasswordPage.abrir();
    const token = await this.forgotPasswordPage.solicitarERetornarToken(usuarioLogado.cadastro.email);
    const redefinicao = redefinicaoSenhaE2E(token);

    await this.dbService.validarTokenRecuperacaoGerado(token, usuarioLogado.cadastro.email);
    await this.resetPasswordPage.abrirComToken(token);
    await this.resetPasswordPage.redefinir(redefinicao);
    await this.dbService.validarTokenRecuperacaoUsado(token);
    await this.loginPage.abrir();
    await this.loginPage.autenticarComSenha(usuarioLogado.cadastro.email, redefinicao.senha);
    await this.dashboardPage.validarUsuarioExibido(usuarioLogado.usuario.nome);
  }

  async validarPublicacaoProduto(loja, produto, usuarioLogado) {
    await this.definirSessao(usuarioLogado);
    await this.cardapioAdminPage.abrir();
    await this.cardapioAdminPage.criarProduto(produto);
    const produtoDb = await this.dbService.validarProdutoCriado(usuarioLogado.lojaId, produto);

    await this.cardapioAdminPage.validarProdutoNoCardapio(produtoDb.id);
    await this.cardapioPublicoPage.abrir(loja.slug);
    await this.cardapioPublicoPage.validarProduto(produtoDb.id, produto.nome);
    await this.cardapioAdminPage.abrir();
    await this.cardapioAdminPage.alternarDisponibilidade(produtoDb.id);
    await this.dbService.validarProdutoDisponibilidade(produtoDb.id, false);
    await this.cardapioAdminPage.excluirProduto(produtoDb.id);
    await this.dbService.validarProdutoRemovido(produtoDb.id);
  }

  async validarPedidoPickup(catalogo, checkout, loja, usuarioLogado) {
    await this.definirSessao(usuarioLogado);
    await this.cardapioPublicoPage.abrir(loja.slug);
    await this.cardapioPublicoPage.adicionarProdutoAoCarrinho(catalogo.produto.id);
    await this.cardapioPublicoPage.abrirCheckout();
    await this.cardapioPublicoPage.concluirPedidoPickup(checkout);

    await this.dbService.validarClienteCriado(usuarioLogado.lojaId, checkout);
    const pedidoDb = await this.dbService.validarPedidoCriado({
      lojaId: usuarioLogado.lojaId,
      checkout,
      tipo: 'PICKUP',
      produtoId: catalogo.produto.id,
    });

    await this.pedidosPage.abrir();
    await this.pedidosPage.avancarStatusPedido(pedidoDb.pedido.id);
    await this.dbService.validarStatusPedido(pedidoDb.pedido.id, 'PREPARING');
  }

  async validarPedidoDelivery(catalogo, checkout, loja, usuarioLogado) {
    await this.definirSessao(usuarioLogado);
    await this.cardapioPublicoPage.abrir(loja.slug);
    await this.cardapioPublicoPage.adicionarProdutoAoCarrinho(catalogo.produto.id);
    await this.cardapioPublicoPage.abrirCheckout();
    await this.cardapioPublicoPage.concluirPedidoDelivery(checkout);

    const cliente = await this.dbService.validarClienteCriado(usuarioLogado.lojaId, checkout);
    await this.dbService.validarEnderecoCriado(cliente.id, checkout);
    await this.dbService.validarPedidoCriado({
      lojaId: usuarioLogado.lojaId,
      checkout,
      tipo: 'DELIVERY',
      produtoId: catalogo.produto.id,
    });

    await this.dashboardResumoPage.abrir();
    await this.dashboardResumoPage.validarCardsEGrafico();
    await this.dashboardResumoPage.validarPedidosRecentes();
    await this.clientesPage.abrir();
    await this.clientesPage.buscar(checkout.telefone);
    await this.clientesPage.validarClienteNaLista(cliente.id);
    await this.clientesPage.abrirCliente(cliente.id);
    await this.clientesPage.validarDetalhe();
  }

  async validarConfiguracoes(configuracao, usuarioLogado) {
    await this.definirSessao(usuarioLogado);
    await this.configuracoesPage.abrir();
    await this.configuracoesPage.validarSecoes();
    await this.configuracoesPage.atualizarDados(configuracao);
    await this.dbService.validarLojaAtualizada(usuarioLogado.lojaId, configuracao);

    const pausaManual = await this.configuracoesPage.alternarLoja();
    await this.dbService.validarPausaManual(usuarioLogado.lojaId, pausaManual.pausadaManualmente);

    await this.configuracoesPage.atualizarHorario(configuracao);
    await this.dbService.validarHorario(usuarioLogado.lojaId, configuracao);

    await this.configuracoesPage.adicionarTaxa();
    const taxa = await this.dbService.validarTaxaCriada(usuarioLogado.lojaId);
    await this.configuracoesPage.removerTaxa(taxa.id);
    await this.dbService.validarTaxaRemovida(taxa.id);
  }

  async definirSessao(usuarioLogado) {
    await this.sessaoBrowserService.definirSessao({
      token: usuarioLogado.token,
      usuario: usuarioLogado.usuario,
    });
  }
}
