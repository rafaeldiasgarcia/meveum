insert into orders (
    id,
    store_id,
    customer_id,
    customer_name,
    customer_phone,
    fulfillment_type,
    status,
    payment_method,
    subtotal,
    delivery_fee,
    discount_total,
    total,
    needs_change,
    change_for,
    customer_note,
    delivery_address_snapshot
) values (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    '99999999-9999-9999-9999-999999999999',
    'Cliente Teste',
    '11999999999',
    'PICKUP',
    'NEW',
    'PIX',
    34.40,
    0,
    0,
    34.40,
    false,
    null,
    'Pedido teste criado por migration',
    null
) on conflict (id) do update set
    customer_name = excluded.customer_name,
    customer_phone = excluded.customer_phone,
    fulfillment_type = excluded.fulfillment_type,
    status = excluded.status,
    payment_method = excluded.payment_method,
    subtotal = excluded.subtotal,
    delivery_fee = excluded.delivery_fee,
    discount_total = excluded.discount_total,
    total = excluded.total,
    needs_change = excluded.needs_change,
    change_for = excluded.change_for,
    customer_note = excluded.customer_note,
    delivery_address_snapshot = excluded.delivery_address_snapshot,
    updated_at = now();

insert into order_items (
    id,
    order_id,
    product_id,
    product_name,
    unit_price,
    quantity,
    total,
    note
) values (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '33333333-3333-3333-3333-333333333333',
    'Produto Teste Bruno',
    29.90,
    1,
    34.40,
    'Item teste criado por migration'
) on conflict (id) do update set
    product_name = excluded.product_name,
    unit_price = excluded.unit_price,
    quantity = excluded.quantity,
    total = excluded.total,
    note = excluded.note;

insert into order_item_complements (
    id,
    order_item_id,
    complement_group_id,
    complement_group_name,
    complement_option_id,
    complement_option_name,
    unit_price,
    quantity,
    total
) values (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '44444444-4444-4444-4444-444444444444',
    'Grupo Complemento Teste Bruno',
    '55555555-5555-5555-5555-555555555555',
    'Opcao Complemento Teste Bruno',
    4.50,
    1,
    4.50
) on conflict (id) do update set
    complement_group_name = excluded.complement_group_name,
    complement_option_name = excluded.complement_option_name,
    unit_price = excluded.unit_price,
    quantity = excluded.quantity,
    total = excluded.total;
