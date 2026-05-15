import { expect } from '@playwright/test';
import pg from 'pg';

const { Pool } = pg;
const DB_ASSERT_TIMEOUT = Number(process.env.DB_ASSERT_TIMEOUT ?? 10_000);
const DB_ASSERT_INTERVALS = [100, 250, 500, 1_000];

function toNumber(valor) {
  return Number(valor);
}

function toDinheiro(valor) {
  return Number(Number(valor).toFixed(2));
}

export class DatabaseService {
  constructor() {
    this.pool = new Pool({
      host: process.env.PGHOST ?? process.env.DB_HOST ?? '127.0.0.1',
      port: Number(process.env.PGPORT ?? process.env.DB_PORT ?? 5432),
      database: process.env.PGDATABASE ?? process.env.DB_NAME ?? 'meveum',
      user: process.env.PGUSER ?? process.env.DB_USER ?? 'meveum',
      password: process.env.PGPASSWORD ?? process.env.DB_PASSWORD ?? 'meveum',
      max: 2,
    });
  }

  async fechar() {
    await this.pool.end();
  }

  async validarComRetry(validacao) {
    let resultado;

    await expect(async () => {
      resultado = await validacao();
    }).toPass({
      intervals: DB_ASSERT_INTERVALS,
      timeout: DB_ASSERT_TIMEOUT,
    });

    return resultado;
  }

  async buscarUm(sql, params = []) {
    const resultado = await this.pool.query(sql, params);
    return resultado.rows[0] ?? null;
  }

  async buscarTodos(sql, params = []) {
    const resultado = await this.pool.query(sql, params);
    return resultado.rows;
  }

  async validarUsuarioELojaCriados(cadastro) {
    return this.validarComRetry(async () => {
      const usuario = await this.buscarUsuarioPorEmail(cadastro.email);
      expect(usuario).not.toBeNull();
      expect(usuario.name).toBe(cadastro.nome);
      expect(usuario.email).toBe(cadastro.email.toLowerCase());
      expect(usuario.role).toBe('OWNER');

      const loja = await this.buscarLojaPorId(usuario.store_id);
      expect(loja).not.toBeNull();
      expect(loja.name).toBe(cadastro.nomeLoja);
      expect(loja.whatsapp_number).toBe(cadastro.telefone.replace(/\D/g, ''));
      expect(loja.status).toBe('ACTIVE');

      return { usuario, loja };
    });
  }

  async validarTokenRecuperacaoGerado(token, email) {
    return this.validarComRetry(async () => {
      const registro = await this.buscarUm(
        `
          select prt.*
          from password_reset_tokens prt
          join store_users su on su.id = prt.store_user_id
          where prt.token = $1 and su.email = $2
        `,
        [token, email.toLowerCase()]
      );

      expect(registro).not.toBeNull();
      expect(registro.used_at).toBeNull();
      return registro;
    });
  }

  async validarTokenRecuperacaoUsado(token) {
    return this.validarComRetry(async () => {
      const registro = await this.buscarUm(
        'select * from password_reset_tokens where token = $1',
        [token]
      );

      expect(registro).not.toBeNull();
      expect(registro.used_at).not.toBeNull();
      return registro;
    });
  }

  async validarProdutoCriado(lojaId, produtoEsperado) {
    return this.validarComRetry(async () => {
      const produto = await this.buscarProdutoPorNome(lojaId, produtoEsperado.nome);
      expect(produto).not.toBeNull();
      expect(produto.description).toBe(produtoEsperado.descricao);
      expect(toDinheiro(produto.base_price)).toBe(toDinheiro(produtoEsperado.preco));
      expect(produto.active).toBe(true);
      expect(produto.available).toBe(true);
      return produto;
    });
  }

  async validarProdutoDisponibilidade(produtoId, disponivel) {
    return this.validarComRetry(async () => {
      const produto = await this.buscarProdutoPorId(produtoId);
      expect(produto).not.toBeNull();
      expect(produto.available).toBe(disponivel);
      return produto;
    });
  }

  async validarProdutoRemovido(produtoId) {
    return this.validarComRetry(async () => {
      const produto = await this.buscarProdutoPorId(produtoId);
      expect(produto).not.toBeNull();
      expect(produto.active).toBe(false);
      return produto;
    });
  }

  async validarPedidoCriado({ lojaId, checkout, tipo, produtoId }) {
    return this.validarComRetry(async () => {
      const pedido = await this.buscarPedidoMaisRecente(lojaId, checkout.telefone, tipo);
      expect(pedido).not.toBeNull();
      expect(pedido.customer_name).toBe(checkout.nome);
      expect(pedido.customer_phone).toBe(checkout.telefone);
      expect(pedido.fulfillment_type).toBe(tipo);
      expect(pedido.status).toBe('NEW');
      expect(pedido.payment_method).toBe(checkout.formaPagamento);
      expect(toNumber(pedido.total)).toBeGreaterThan(0);
      expect(toNumber(pedido.delivery_fee)).toBe(tipo === 'DELIVERY' ? toDinheiro(checkout.taxaEntrega) : 0);

      const itens = await this.buscarItensPedido(pedido.id);
      expect(itens.length).toBeGreaterThan(0);
      if (produtoId) {
        expect(itens.some((item) => item.product_id === produtoId)).toBe(true);
      }
      return { pedido, itens };
    });
  }

  async validarClienteCriado(lojaId, checkout) {
    return this.validarComRetry(async () => {
      const cliente = await this.buscarClientePorTelefone(lojaId, checkout.telefone);
      expect(cliente).not.toBeNull();
      expect(cliente.name).toBe(checkout.nome);
      return cliente;
    });
  }

  async validarEnderecoCriado(clienteId, checkout) {
    return this.validarComRetry(async () => {
      const endereco = await this.buscarUm(
        `
          select *
          from customer_addresses
          where customer_id = $1
          order by id desc
          limit 1
        `,
        [clienteId]
      );

      expect(endereco).not.toBeNull();
      expect(endereco.street).toBe(checkout.rua);
      expect(endereco.number).toBe(checkout.numero);
      expect(endereco.neighborhood).toBe(checkout.bairro);
      expect(endereco.city).toBe(checkout.cidade);
      expect(endereco.state).toBe(checkout.estado);
      return endereco;
    });
  }

  async validarStatusPedido(pedidoId, status) {
    return this.validarComRetry(async () => {
      const pedido = await this.buscarPedidoPorId(pedidoId);
      expect(pedido).not.toBeNull();
      expect(pedido.status).toBe(status);
      return pedido;
    });
  }

  async validarLojaAtualizada(lojaId, configuracao) {
    return this.validarComRetry(async () => {
      const loja = await this.buscarLojaPorId(lojaId);
      expect(loja).not.toBeNull();
      expect(loja.name).toBe(configuracao.nome);
      expect(loja.whatsapp_number).toBe(configuracao.whatsapp);
      return loja;
    });
  }

  async validarPausaManual(lojaId, pausada) {
    return this.validarComRetry(async () => {
      const loja = await this.buscarLojaPorId(lojaId);
      expect(loja).not.toBeNull();
      expect(loja.manually_paused).toBe(pausada);
      return loja;
    });
  }

  async validarHorario(lojaId, configuracao) {
    return this.validarComRetry(async () => {
      const diaSemana = { seg: 1, ter: 2, qua: 3, qui: 4, sex: 5, sab: 6, dom: 7 }[configuracao.diaSemana];
      const horario = await this.buscarUm(
        `
          select *
          from store_opening_periods
          where store_id = $1 and day_of_week = $2
          order by id desc
          limit 1
        `,
        [lojaId, diaSemana]
      );

      expect(horario).not.toBeNull();
      expect(String(horario.opens_at).slice(0, 5)).toBe(configuracao.abertura);
      expect(String(horario.closes_at).slice(0, 5)).toBe(configuracao.fechamento);
      return horario;
    });
  }

  async validarTaxaCriada(lojaId) {
    return this.validarComRetry(async () => {
      const taxa = await this.buscarUm(
        `
          select *
          from store_delivery_zones
          where store_id = $1 and name = 'Nova taxa de entrega' and active = true
          order by id desc
          limit 1
        `,
        [lojaId]
      );

      expect(taxa).not.toBeNull();
      expect(toDinheiro(taxa.fee)).toBe(0);
      return taxa;
    });
  }

  async validarTaxaRemovida(taxaId) {
    return this.validarComRetry(async () => {
      const taxa = await this.buscarUm(
        'select * from store_delivery_zones where id = $1',
        [taxaId]
      );

      expect(taxa).not.toBeNull();
      expect(taxa.active).toBe(false);
      return taxa;
    });
  }

  async buscarUsuarioPorEmail(email) {
    return this.buscarUm('select * from store_users where email = $1', [email.toLowerCase()]);
  }

  async buscarLojaPorId(lojaId) {
    return this.buscarUm('select * from stores where id = $1', [lojaId]);
  }

  async buscarProdutoPorNome(lojaId, nome) {
    return this.buscarUm(
      'select * from products where store_id = $1 and name = $2 order by created_at desc limit 1',
      [lojaId, nome]
    );
  }

  async buscarProdutoPorId(produtoId) {
    return this.buscarUm('select * from products where id = $1', [produtoId]);
  }

  async buscarClientePorTelefone(lojaId, telefone) {
    return this.buscarUm(
      'select * from customers where store_id = $1 and phone = $2',
      [lojaId, telefone]
    );
  }

  async buscarPedidoPorId(pedidoId) {
    return this.buscarUm('select * from orders where id = $1', [pedidoId]);
  }

  async buscarPedidoMaisRecente(lojaId, telefone, tipo) {
    return this.buscarUm(
      `
        select *
        from orders
        where store_id = $1 and customer_phone = $2 and fulfillment_type = $3
        order by created_at desc
        limit 1
      `,
      [lojaId, telefone, tipo]
    );
  }

  async buscarItensPedido(pedidoId) {
    return this.buscarTodos(
      'select * from order_items where order_id = $1 order by id asc',
      [pedidoId]
    );
  }
}
