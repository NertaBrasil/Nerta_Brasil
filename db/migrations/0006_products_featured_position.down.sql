drop index if exists products_featured_position_unique;
alter table products drop column if exists featured_position;
