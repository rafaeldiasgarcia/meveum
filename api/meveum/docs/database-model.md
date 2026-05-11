# Modelo de banco inicial - Meveum

Objetivo: suportar um cardapio digital e sistema de pedidos no estilo Anota Ai,
com multi-tenancy por loja, checkout via WhatsApp e painel de controle para o
lojista.

## Decisoes principais

- Cada loja e um tenant. Quase todas as tabelas de negocio carregam `store_id`.
- O slug da loja e unico e usado para carregar o cardapio publico.
- Produto, categoria e complementos usam `active` para esconder sem perder
  historico.
- Pedido salva snapshot de nome, preco e complementos, porque o cardapio pode
  mudar depois que o pedido foi feito.
- Horario de funcionamento aceita varios periodos por dia para permitir pausa
  entre almoco e jantar.
- Entrega comeca flexivel: bairro, faixa de CEP ou raio.
- Pagamento aceito pela loja fica separado da forma escolhida no pedido.

## Tabelas base

### stores

Representa o tenant/loja.

Campos principais:

- `id`
- `name`
- `slug`
- `logo_url`
- `whatsapp_number`
- `status`
- `manually_paused`
- `created_at`
- `updated_at`

Observacoes:

- `slug` deve ser unico.
- `status`: `ACTIVE`, `INACTIVE`.
- `manually_paused` atende o botao de pausa da loja.

### store_users

Usuarios administrativos da loja.

Campos principais:

- `id`
- `store_id`
- `name`
- `email`
- `password_hash`
- `role`
- `active`
- `created_at`
- `updated_at`

Observacoes:

- `email` deve ser unico globalmente no MVP.
- `role`: `OWNER`, `MANAGER`, `STAFF`.

### store_opening_periods

Periodos de funcionamento.

Campos principais:

- `id`
- `store_id`
- `day_of_week`
- `opens_at`
- `closes_at`
- `active`

Observacoes:

- `day_of_week`: 1 a 7, seguindo ISO: segunda=1, domingo=7.
- Permite mais de um periodo no mesmo dia.

### store_delivery_zones

Areas e taxas de entrega.

Campos principais:

- `id`
- `store_id`
- `name`
- `type`
- `neighborhood`
- `zip_code_start`
- `zip_code_end`
- `radius_km`
- `fee`
- `minimum_order_value`
- `estimated_minutes`
- `active`

Observacoes:

- `type`: `NEIGHBORHOOD`, `ZIP_RANGE`, `RADIUS`.
- Nem todos os campos sao obrigatorios para todos os tipos.

### store_payment_methods

Formas de pagamento aceitas pela loja.

Campos principais:

- `id`
- `store_id`
- `method`
- `active`

Observacoes:

- `method`: `PIX`, `CREDIT_CARD_DELIVERY`, `DEBIT_CARD_DELIVERY`, `CASH`.

## Catalogo

### categories

Categorias do cardapio.

Campos principais:

- `id`
- `store_id`
- `name`
- `description`
- `sort_order`
- `active`
- `created_at`
- `updated_at`

### products

Produtos do cardapio.

Campos principais:

- `id`
- `store_id`
- `category_id`
- `name`
- `description`
- `base_price`
- `image_url`
- `sort_order`
- `active`
- `created_at`
- `updated_at`

Observacoes:

- Produto pertence a uma categoria.
- `store_id` tambem fica no produto para consultas rapidas por loja.

### complement_groups

Grupos de complementos, como "Adicionais" ou "Escolha o ponto".

Campos principais:

- `id`
- `store_id`
- `name`
- `description`
- `min_quantity`
- `max_quantity`
- `sort_order`
- `active`
- `created_at`
- `updated_at`

Observacoes:

- `min_quantity > 0` torna o grupo obrigatorio.
- `max_quantity` controla limite de selecao.

### complement_options

Opcoes dentro de um grupo de complementos.

Campos principais:

- `id`
- `store_id`
- `complement_group_id`
- `name`
- `description`
- `additional_price`
- `sort_order`
- `active`

### product_complement_groups

Vinculo N:N entre produto e grupo de complemento.

Campos principais:

- `id`
- `product_id`
- `complement_group_id`
- `sort_order`
- `active`

Observacoes:

- Permite reutilizar o mesmo grupo em varios produtos.

## Checkout e pedidos

### customers

Cliente final. Pode ser simples no MVP.

Campos principais:

- `id`
- `store_id`
- `name`
- `phone`
- `created_at`
- `updated_at`

Observacoes:

- Mesmo telefone pode existir em lojas diferentes.

### customer_addresses

Enderecos salvos ou usados em pedidos.

Campos principais:

- `id`
- `customer_id`
- `label`
- `street`
- `number`
- `complement`
- `neighborhood`
- `city`
- `state`
- `zip_code`
- `reference`
- `latitude`
- `longitude`

### orders

Pedido gerado no checkout e usado no painel do lojista.

Campos principais:

- `id`
- `store_id`
- `customer_id`
- `customer_name`
- `customer_phone`
- `fulfillment_type`
- `status`
- `payment_method`
- `subtotal`
- `delivery_fee`
- `discount_total`
- `total`
- `needs_change`
- `change_for`
- `customer_note`
- `delivery_address_snapshot`
- `whatsapp_message`
- `created_at`
- `updated_at`

Observacoes:

- `fulfillment_type`: `DELIVERY`, `PICKUP`.
- `status`: `NEW`, `PREPARING`, `OUT_FOR_DELIVERY`, `DONE`, `CANCELED`.
- `delivery_address_snapshot` pode ser `jsonb` no PostgreSQL.
- `whatsapp_message` guarda o texto enviado/gerado para auditoria.

### order_items

Itens do pedido com snapshot do produto.

Campos principais:

- `id`
- `order_id`
- `product_id`
- `product_name`
- `unit_price`
- `quantity`
- `total`
- `note`

### order_item_complements

Complementos escolhidos em um item do pedido.

Campos principais:

- `id`
- `order_item_id`
- `complement_group_id`
- `complement_group_name`
- `complement_option_id`
- `complement_option_name`
- `unit_price`
- `quantity`
- `total`

## Modelo visual simplificado

```mermaid
```mermaid
erDiagram
    STORES {
        uuid id PK
        varchar name
        varchar slug UK
        varchar logo_url
        varchar whatsapp_number
        varchar status
        boolean manually_paused
        timestamptz created_at
        timestamptz updated_at
    }

    STORE_USERS {
        uuid id PK
        uuid store_id FK
        varchar name
        varchar email UK
        varchar password_hash
        varchar role
        boolean active
    }

    STORE_OPENING_PERIODS {
        uuid id PK
        uuid store_id FK
        smallint day_of_week
        time opens_at
        time closes_at
        boolean active
    }

    STORE_DELIVERY_ZONES {
        uuid id PK
        uuid store_id FK
        varchar name
        varchar type
        varchar neighborhood
        varchar zip_code_start
        varchar zip_code_end
        numeric radius_km
        numeric fee
        boolean active
    }

    STORE_PAYMENT_METHODS {
        uuid id PK
        uuid store_id FK
        varchar method
        boolean active
    }

    CATEGORIES {
        uuid id PK
        uuid store_id FK
        varchar name
        integer sort_order
        boolean active
    }

    PRODUCTS {
        uuid id PK
        uuid store_id FK
        uuid category_id FK
        varchar name
        text description
        numeric base_price
        varchar image_url
        integer sort_order
        boolean active
    }

    COMPLEMENT_GROUPS {
        uuid id PK
        uuid store_id FK
        varchar name
        integer min_quantity
        integer max_quantity
        integer sort_order
        boolean active
    }

    COMPLEMENT_OPTIONS {
        uuid id PK
        uuid store_id FK
        uuid complement_group_id FK
        varchar name
        numeric additional_price
        integer sort_order
        boolean active
    }

    PRODUCT_COMPLEMENT_GROUPS {
        uuid id PK
        uuid product_id FK
        uuid complement_group_id FK
        integer sort_order
        boolean active
    }

    CUSTOMERS {
        uuid id PK
        uuid store_id FK
        varchar name
        varchar phone
    }

    CUSTOMER_ADDRESSES {
        uuid id PK
        uuid customer_id FK
        varchar street
        varchar number
        varchar neighborhood
        varchar city
        varchar state
        varchar zip_code
    }

    ORDERS {
        uuid id PK
        uuid store_id FK
        uuid customer_id FK
        varchar customer_name
        varchar customer_phone
        varchar fulfillment_type
        varchar status
        varchar payment_method
        numeric subtotal
        numeric delivery_fee
        numeric total
        boolean needs_change
        numeric change_for
        jsonb delivery_address_snapshot
        text whatsapp_message
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        varchar product_name
        numeric unit_price
        integer quantity
        numeric total
    }

    ORDER_ITEM_COMPLEMENTS {
        uuid id PK
        uuid order_item_id FK
        uuid complement_group_id FK
        varchar complement_group_name
        uuid complement_option_id FK
        varchar complement_option_name
        numeric unit_price
        integer quantity
        numeric total
    }

    STORES ||--o{ STORE_USERS : possui
    STORES ||--o{ STORE_OPENING_PERIODS : configura
    STORES ||--o{ STORE_DELIVERY_ZONES : atende
    STORES ||--o{ STORE_PAYMENT_METHODS : aceita
    STORES ||--o{ CATEGORIES : organiza
    STORES ||--o{ PRODUCTS : vende
    STORES ||--o{ COMPLEMENT_GROUPS : define
    STORES ||--o{ CUSTOMERS : atende
    STORES ||--o{ ORDERS : recebe

    CATEGORIES ||--o{ PRODUCTS : contem
    COMPLEMENT_GROUPS ||--o{ COMPLEMENT_OPTIONS : contem
    PRODUCTS ||--o{ PRODUCT_COMPLEMENT_GROUPS : usa
    COMPLEMENT_GROUPS ||--o{ PRODUCT_COMPLEMENT_GROUPS : vincula

    CUSTOMERS ||--o{ CUSTOMER_ADDRESSES : possui
    CUSTOMERS ||--o{ ORDERS : faz

    ORDERS ||--o{ ORDER_ITEMS : contem
    ORDER_ITEMS ||--o{ ORDER_ITEM_COMPLEMENTS : possui

```
```

## MVP recomendado

Comecar com:

- `stores`
- `store_users`
- `store_opening_periods`
- `store_delivery_zones`
- `store_payment_methods`
- `categories`
- `products`
- `complement_groups`
- `complement_options`
- `product_complement_groups`
- `customers`
- `customer_addresses`
- `orders`
- `order_items`
- `order_item_complements`

Deixar para depois:

- cupons/descontos avancados
- promocoes por horario
- estoque
- impressao de pedido
- integracao com pagamento online
- notificacoes reais por WhatsApp API
- multi-filial
- plano/assinatura da loja
