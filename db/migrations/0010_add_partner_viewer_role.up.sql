alter table admin_profiles
  drop constraint if exists admin_profiles_role_check,
  add constraint admin_profiles_role_check
    check (role in ('admin', 'editor', 'partner_viewer'));
