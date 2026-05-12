insert into customers (
    id,
    store_id,
    name,
    phone
) values (
    '99999999-9999-9999-9999-999999999999',
    '11111111-1111-1111-1111-111111111111',
    'Cliente Teste',
    '11999999999'
) on conflict (store_id, phone) do update set
    name = excluded.name;

insert into customer_addresses (
    id,
    customer_id,
    label,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    zip_code,
    reference,
    latitude,
    longitude
) values (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '99999999-9999-9999-9999-999999999999',
    'Casa',
    'Rua Teste',
    '100',
    'Apto 1',
    'Centro',
    'Sao Paulo',
    'SP',
    '01000-000',
    'Portao azul',
    -23.5500000,
    -46.6300000
) on conflict (id) do update set
    label = excluded.label,
    street = excluded.street,
    number = excluded.number,
    complement = excluded.complement,
    neighborhood = excluded.neighborhood,
    city = excluded.city,
    state = excluded.state,
    zip_code = excluded.zip_code,
    reference = excluded.reference,
    latitude = excluded.latitude,
    longitude = excluded.longitude;
