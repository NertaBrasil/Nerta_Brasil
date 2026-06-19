-- Rollback do grant de acesso a Data API — Nerta Brasil

revoke select on categories from anon, authenticated;
revoke select on products from anon, authenticated;
revoke select on product_images from anon, authenticated;
revoke select on admin_profiles from authenticated;
