insert into products (
    id,
    store_id,
    category_id,
    name,
    description,
    base_price,
    image_url,
    sort_order,
    active
) values (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'Produto Teste Bruno',
    'Produto criado por migration para testes manuais no Bruno',
    29.90,
    null,
    1,
    true
) on conflict (id) do update set
    category_id = excluded.category_id,
    name = excluded.name,
    description = excluded.description,
    base_price = excluded.base_price,
    image_url = excluded.image_url,
    sort_order = excluded.sort_order,
    active = excluded.active,
    updated_at = now();
