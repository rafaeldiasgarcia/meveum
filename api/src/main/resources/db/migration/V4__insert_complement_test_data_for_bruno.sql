insert into complement_groups (
    id,
    store_id,
    name,
    description,
    min_quantity,
    max_quantity,
    sort_order,
    active
) values (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'Grupo Complemento Teste Bruno',
    'Grupo de complemento usado para testes manuais no Bruno',
    0,
    2,
    1,
    true
) on conflict (id) do update set
    name = excluded.name,
    description = excluded.description,
    min_quantity = excluded.min_quantity,
    max_quantity = excluded.max_quantity,
    sort_order = excluded.sort_order,
    active = excluded.active,
    updated_at = now();

insert into complement_options (
    id,
    store_id,
    complement_group_id,
    name,
    description,
    additional_price,
    sort_order,
    active
) values (
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444444',
    'Opcao Complemento Teste Bruno',
    'Opcao de complemento usada para testes manuais no Bruno',
    4.50,
    1,
    true
) on conflict (id) do update set
    name = excluded.name,
    description = excluded.description,
    additional_price = excluded.additional_price,
    sort_order = excluded.sort_order,
    active = excluded.active;
