insert into store_delivery_zones (
    id,
    store_id,
    name,
    type,
    neighborhood,
    fee,
    minimum_order_value,
    estimated_minutes,
    active
) values (
    '77777777-7777-7777-7777-777777777777',
    '11111111-1111-1111-1111-111111111111',
    'Area Entrega Teste',
    'NEIGHBORHOOD',
    'Centro',
    7.00,
    25.00,
    45,
    true
) on conflict (id) do update set
    name = excluded.name,
    type = excluded.type,
    neighborhood = excluded.neighborhood,
    fee = excluded.fee,
    minimum_order_value = excluded.minimum_order_value,
    estimated_minutes = excluded.estimated_minutes,
    active = excluded.active;
