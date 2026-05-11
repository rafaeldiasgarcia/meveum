insert into stores (
    id,
    name,
    slug,
    logo_url,
    whatsapp_number,
    status,
    manually_paused
) values (
    '11111111-1111-1111-1111-111111111111',
    'Loja Teste Bruno',
    'loja-teste-bruno',
    null,
    '5511999999999',
    'ACTIVE',
    false
) on conflict (slug) do update set
    name = excluded.name,
    logo_url = excluded.logo_url,
    whatsapp_number = excluded.whatsapp_number,
    status = excluded.status,
    manually_paused = excluded.manually_paused,
    updated_at = now();

insert into categories (
    id,
    store_id,
    name,
    description,
    sort_order,
    active
) values (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Categoria Teste Bruno',
    'Categoria criada por migration para testes manuais no Bruno',
    1,
    true
) on conflict (id) do update set
    name = excluded.name,
    description = excluded.description,
    sort_order = excluded.sort_order,
    active = excluded.active,
    updated_at = now();
