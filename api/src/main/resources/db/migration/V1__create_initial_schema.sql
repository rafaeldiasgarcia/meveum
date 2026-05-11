create extension if not exists pgcrypto;

create table stores (
    id uuid primary key default gen_random_uuid(),
    name varchar(120) not null,
    slug varchar(80) not null,
    logo_url varchar(500),
    whatsapp_number varchar(20) not null,
    status varchar(20) not null default 'ACTIVE',
    manually_paused boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uk_stores_slug unique (slug),
    constraint ck_stores_status check (status in ('ACTIVE', 'INACTIVE'))
);

create table store_users (
    id uuid primary key default gen_random_uuid(),
    store_id uuid not null references stores (id),
    name varchar(120) not null,
    email varchar(160) not null,
    password_hash varchar(255) not null,
    role varchar(20) not null default 'OWNER',
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uk_store_users_email unique (email),
    constraint ck_store_users_role check (role in ('OWNER', 'MANAGER', 'STAFF'))
);

create table store_opening_periods (
    id uuid primary key default gen_random_uuid(),
    store_id uuid not null references stores (id),
    day_of_week smallint not null,
    opens_at time not null,
    closes_at time not null,
    active boolean not null default true,
    constraint ck_store_opening_periods_day check (day_of_week between 1 and 7),
    constraint ck_store_opening_periods_time check (opens_at <> closes_at)
);

create table store_delivery_zones (
    id uuid primary key default gen_random_uuid(),
    store_id uuid not null references stores (id),
    name varchar(120) not null,
    type varchar(20) not null,
    neighborhood varchar(120),
    zip_code_start varchar(12),
    zip_code_end varchar(12),
    radius_km numeric(8, 2),
    fee numeric(12, 2) not null default 0,
    minimum_order_value numeric(12, 2),
    estimated_minutes integer,
    active boolean not null default true,
    constraint ck_store_delivery_zones_type check (type in ('NEIGHBORHOOD', 'ZIP_RANGE', 'RADIUS')),
    constraint ck_store_delivery_zones_fee check (fee >= 0),
    constraint ck_store_delivery_zones_minimum_order check (minimum_order_value is null or minimum_order_value >= 0),
    constraint ck_store_delivery_zones_estimated check (estimated_minutes is null or estimated_minutes > 0),
    constraint ck_store_delivery_zones_radius check (radius_km is null or radius_km > 0)
);

create table store_payment_methods (
    id uuid primary key default gen_random_uuid(),
    store_id uuid not null references stores (id),
    method varchar(40) not null,
    active boolean not null default true,
    constraint uk_store_payment_methods_store_method unique (store_id, method),
    constraint ck_store_payment_methods_method check (
        method in ('PIX', 'CREDIT_CARD_DELIVERY', 'DEBIT_CARD_DELIVERY', 'CASH')
    )
);

create table categories (
    id uuid primary key default gen_random_uuid(),
    store_id uuid not null references stores (id),
    name varchar(120) not null,
    description varchar(500),
    sort_order integer not null default 0,
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table products (
    id uuid primary key default gen_random_uuid(),
    store_id uuid not null references stores (id),
    category_id uuid not null references categories (id),
    name varchar(140) not null,
    description text,
    base_price numeric(12, 2) not null,
    image_url varchar(500),
    sort_order integer not null default 0,
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint ck_products_base_price check (base_price >= 0)
);

create table complement_groups (
    id uuid primary key default gen_random_uuid(),
    store_id uuid not null references stores (id),
    name varchar(120) not null,
    description varchar(500),
    min_quantity integer not null default 0,
    max_quantity integer not null default 1,
    sort_order integer not null default 0,
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint ck_complement_groups_quantities check (
        min_quantity >= 0 and max_quantity >= 1 and max_quantity >= min_quantity
    )
);

create table complement_options (
    id uuid primary key default gen_random_uuid(),
    store_id uuid not null references stores (id),
    complement_group_id uuid not null references complement_groups (id),
    name varchar(120) not null,
    description varchar(500),
    additional_price numeric(12, 2) not null default 0,
    sort_order integer not null default 0,
    active boolean not null default true,
    constraint ck_complement_options_price check (additional_price >= 0)
);

create table product_complement_groups (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references products (id),
    complement_group_id uuid not null references complement_groups (id),
    sort_order integer not null default 0,
    active boolean not null default true,
    constraint uk_product_complement_groups_product_group unique (product_id, complement_group_id)
);

create table customers (
    id uuid primary key default gen_random_uuid(),
    store_id uuid not null references stores (id),
    name varchar(120) not null,
    phone varchar(20) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uk_customers_store_phone unique (store_id, phone)
);

create table customer_addresses (
    id uuid primary key default gen_random_uuid(),
    customer_id uuid not null references customers (id),
    label varchar(80),
    street varchar(160) not null,
    number varchar(30) not null,
    complement varchar(120),
    neighborhood varchar(120) not null,
    city varchar(120) not null,
    state varchar(2) not null,
    zip_code varchar(12),
    reference varchar(255),
    latitude numeric(10, 7),
    longitude numeric(10, 7)
);

create table orders (
    id uuid primary key default gen_random_uuid(),
    store_id uuid not null references stores (id),
    customer_id uuid references customers (id),
    customer_name varchar(120) not null,
    customer_phone varchar(20) not null,
    fulfillment_type varchar(20) not null,
    status varchar(30) not null default 'NEW',
    payment_method varchar(40) not null,
    subtotal numeric(12, 2) not null,
    delivery_fee numeric(12, 2) not null default 0,
    discount_total numeric(12, 2) not null default 0,
    total numeric(12, 2) not null,
    needs_change boolean not null default false,
    change_for numeric(12, 2),
    customer_note varchar(500),
    delivery_address_snapshot jsonb,
    whatsapp_message text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint ck_orders_fulfillment_type check (fulfillment_type in ('DELIVERY', 'PICKUP')),
    constraint ck_orders_status check (status in ('NEW', 'PREPARING', 'OUT_FOR_DELIVERY', 'DONE', 'CANCELED')),
    constraint ck_orders_payment_method check (
        payment_method in ('PIX', 'CREDIT_CARD_DELIVERY', 'DEBIT_CARD_DELIVERY', 'CASH')
    ),
    constraint ck_orders_money check (
        subtotal >= 0 and delivery_fee >= 0 and discount_total >= 0 and total >= 0
    ),
    constraint ck_orders_change check (
        (needs_change = false and change_for is null)
        or (needs_change = true and change_for is not null and change_for >= total)
    ),
    constraint ck_orders_delivery_address check (
        (fulfillment_type = 'DELIVERY' and delivery_address_snapshot is not null)
        or fulfillment_type = 'PICKUP'
    )
);

create table order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references orders (id) on delete cascade,
    product_id uuid references products (id),
    product_name varchar(140) not null,
    unit_price numeric(12, 2) not null,
    quantity integer not null,
    total numeric(12, 2) not null,
    note varchar(500),
    constraint ck_order_items_money check (unit_price >= 0 and total >= 0),
    constraint ck_order_items_quantity check (quantity > 0)
);

create table order_item_complements (
    id uuid primary key default gen_random_uuid(),
    order_item_id uuid not null references order_items (id) on delete cascade,
    complement_group_id uuid references complement_groups (id),
    complement_group_name varchar(120) not null,
    complement_option_id uuid references complement_options (id),
    complement_option_name varchar(120) not null,
    unit_price numeric(12, 2) not null default 0,
    quantity integer not null default 1,
    total numeric(12, 2) not null default 0,
    constraint ck_order_item_complements_money check (unit_price >= 0 and total >= 0),
    constraint ck_order_item_complements_quantity check (quantity > 0)
);

create index ix_store_users_store_id on store_users (store_id);
create index ix_store_opening_periods_store_day on store_opening_periods (store_id, day_of_week);
create index ix_store_delivery_zones_store_id on store_delivery_zones (store_id);
create index ix_categories_store_order on categories (store_id, sort_order);
create index ix_products_store_category_order on products (store_id, category_id, sort_order);
create index ix_products_store_name on products (store_id, name);
create index ix_complement_groups_store_order on complement_groups (store_id, sort_order);
create index ix_complement_options_group_order on complement_options (complement_group_id, sort_order);
create index ix_product_complement_groups_product on product_complement_groups (product_id);
create index ix_customers_store_phone on customers (store_id, phone);
create index ix_customer_addresses_customer_id on customer_addresses (customer_id);
create index ix_orders_store_status_created on orders (store_id, status, created_at desc);
create index ix_orders_customer_id on orders (customer_id);
create index ix_order_items_order_id on order_items (order_id);
create index ix_order_item_complements_order_item_id on order_item_complements (order_item_id);
