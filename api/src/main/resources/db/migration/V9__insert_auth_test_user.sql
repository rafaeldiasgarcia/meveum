insert into store_users (
    id,
    store_id,
    name,
    email,
    password_hash,
    role,
    active
) values (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '11111111-1111-1111-1111-111111111111',
    'Admin Meveum',
    'admin@meveum.com',
    '$2a$10$I/L/963gQVCUh.bEWJLuf.iXlo2R.gWuSiiRSVk1KmPiJI7qy1UnC',
    'OWNER',
    true
) on conflict (email) do update set
    name = excluded.name,
    password_hash = excluded.password_hash,
    role = excluded.role,
    active = excluded.active,
    updated_at = now();
