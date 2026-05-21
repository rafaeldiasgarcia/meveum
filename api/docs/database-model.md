# Modelo de dados - MeVeUm

Modelo relacional atual da API, baseado nas migrations Flyway de
`V1__create_initial_schema.sql` a `V13__add_product_available_field.sql`.

## Principios

- Cada loja e um tenant; `store_id` separa os dados de negocio.
- O slug da loja carrega o cardapio publico.
- Catalogo usa remocao logica com `active`.
- Produto tem `available` separado de `active` para pausar venda sem excluir.
- Pedido salva snapshots de produto, complemento, endereco e mensagem para
  preservar historico.
- Agregados de dashboard sao calculados por query/service, nao persistidos em
  colunas totalizadoras.
- Flyway e a unica fonte de evolucao do schema; Hibernate roda em
  `ddl-auto=validate`.

## Historico de migrations

| Versao | Objetivo |
|---|---|
| `V1` | Cria schema inicial |
| `V2` | Insere loja e usuario base |
| `V3` | Insere categoria/produto base |
| `V4` | Insere complementos base |
| `V5` | Insere area de entrega |
| `V6` | Insere forma de pagamento |
| `V7` | Insere cliente/endereco |
| `V8` | Insere pedido completo |
| `V9` | Insere usuario autenticavel |
| `V10` | Vincula grupo de complemento ao produto |
| `V11` | Cria `password_reset_tokens` |
| `V12` | Adiciona `phone`, `address`, `description`, `pix_key` em `stores` |
| `V13` | Adiciona `available` em `products` |

## Tabelas

### Loja e autenticacao

| Tabela | Papel |
|---|---|
| `stores` | Tenant/loja, perfil publico e status operacional |
| `store_users` | Usuarios administrativos da loja |
| `password_reset_tokens` | Tokens de recuperacao de senha |

### Operacao da loja

| Tabela | Papel |
|---|---|
| `store_opening_periods` | Periodos de funcionamento por dia |
| `store_delivery_zones` | Areas, taxas, pedido minimo e prazo |
| `store_payment_methods` | Formas de pagamento aceitas |

### Catalogo

| Tabela | Papel |
|---|---|
| `categories` | Categorias do cardapio |
| `products` | Produtos e disponibilidade |
| `complement_groups` | Grupos de complementos |
| `complement_options` | Opcoes dentro dos grupos |
| `product_complement_groups` | Vinculo N:N entre produtos e grupos |

### CRM e pedidos

| Tabela | Papel |
|---|---|
| `customers` | Cliente final por loja |
| `customer_addresses` | Enderecos do cliente |
| `orders` | Pedido e snapshots principais |
| `order_items` | Itens do pedido com snapshot do produto |
| `order_item_complements` | Complementos escolhidos no item |

## Campos principais

### `stores`

- `id`
- `name`
- `slug`
- `logo_url`
- `whatsapp_number`
- `phone`
- `address`
- `description`
- `pix_key`
- `status`: `ACTIVE`, `INACTIVE`
- `manually_paused`
- `created_at`
- `updated_at`

### `store_users`

- `id`
- `store_id`
- `name`
- `email`
- `password_hash`
- `role`: `OWNER`, `MANAGER`, `STAFF`
- `active`
- `created_at`
- `updated_at`

### `password_reset_tokens`

- `id`
- `store_user_id`
- `token`
- `expires_at`
- `used_at`
- `created_at`

### `products`

- `id`
- `store_id`
- `category_id`
- `name`
- `description`
- `base_price`
- `image_url`
- `sort_order`
- `active`
- `available`
- `created_at`
- `updated_at`

### `orders`

- `id`
- `store_id`
- `customer_id`
- `customer_name`
- `customer_phone`
- `fulfillment_type`: `DELIVERY`, `PICKUP`
- `status`: `NEW`, `PREPARING`, `OUT_FOR_DELIVERY`, `DONE`, `CANCELED`
- `payment_method`: `PIX`, `CREDIT_CARD_DELIVERY`, `DEBIT_CARD_DELIVERY`, `CASH`
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

## Diagrama ER

```mermaid
erDiagram
    STORES ||--o{ STORE_USERS : possui
    STORES ||--o{ STORE_OPENING_PERIODS : configura
    STORES ||--o{ STORE_DELIVERY_ZONES : atende
    STORES ||--o{ STORE_PAYMENT_METHODS : aceita
    STORES ||--o{ CATEGORIES : organiza
    STORES ||--o{ PRODUCTS : vende
    STORES ||--o{ COMPLEMENT_GROUPS : define
    STORES ||--o{ CUSTOMERS : atende
    STORES ||--o{ ORDERS : recebe
    STORE_USERS ||--o{ PASSWORD_RESET_TOKENS : gera

    CATEGORIES ||--o{ PRODUCTS : contem
    COMPLEMENT_GROUPS ||--o{ COMPLEMENT_OPTIONS : contem
    PRODUCTS ||--o{ PRODUCT_COMPLEMENT_GROUPS : usa
    COMPLEMENT_GROUPS ||--o{ PRODUCT_COMPLEMENT_GROUPS : vincula

    CUSTOMERS ||--o{ CUSTOMER_ADDRESSES : possui
    CUSTOMERS ||--o{ ORDERS : faz
    ORDERS ||--o{ ORDER_ITEMS : contem
    ORDER_ITEMS ||--o{ ORDER_ITEM_COMPLEMENTS : possui

    STORES {
        uuid id PK
        varchar name
        varchar slug UK
        varchar logo_url
        varchar whatsapp_number
        varchar phone
        varchar address
        varchar description
        varchar pix_key
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

    PASSWORD_RESET_TOKENS {
        uuid id PK
        uuid store_user_id FK
        varchar token
        timestamptz expires_at
        timestamptz used_at
        timestamptz created_at
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
        numeric minimum_order_value
        integer estimated_minutes
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
        varchar description
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
        boolean available
    }

    COMPLEMENT_GROUPS {
        uuid id PK
        uuid store_id FK
        varchar name
        varchar description
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
        varchar description
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
        timestamptz created_at
        timestamptz updated_at
    }

    CUSTOMER_ADDRESSES {
        uuid id PK
        uuid customer_id FK
        varchar label
        varchar street
        varchar number
        varchar complement
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
        numeric discount_total
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
        varchar note
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
```

## Indices e restricoes importantes

- `stores.slug` unico.
- `store_users.email` unico globalmente no MVP.
- `customers (store_id, phone)` unico.
- `store_payment_methods (store_id, method)` unico.
- `product_complement_groups (product_id, complement_group_id)` unico.
- Indices por `store_id`, `status`, `created_at`, `category_id`, `phone` e
  relacionamentos de pedido otimizam listagens e dashboard.

## Seeds de desenvolvimento

Os dados fixos estao documentados em [`../dados/README.md`](../dados/README.md).

Esses dados ajudam em Postman e testes manuais, mas automacoes novas devem criar
dados dinamicos quando precisarem de isolamento.
