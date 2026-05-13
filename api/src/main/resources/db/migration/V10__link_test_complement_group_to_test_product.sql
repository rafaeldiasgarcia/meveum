insert into product_complement_groups (
    id,
    product_id,
    complement_group_id,
    sort_order,
    active
) values (
    '66666666-6666-6666-6666-666666666666',
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444',
    1,
    true
) on conflict (product_id, complement_group_id) do update set
    sort_order = excluded.sort_order,
    active = excluded.active;
