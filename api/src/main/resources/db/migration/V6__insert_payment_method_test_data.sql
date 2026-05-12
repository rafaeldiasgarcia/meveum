insert into store_payment_methods (
    id,
    store_id,
    method,
    active
) values (
    '88888888-8888-8888-8888-888888888888',
    '11111111-1111-1111-1111-111111111111',
    'PIX',
    true
) on conflict (store_id, method) do update set
    active = excluded.active;
