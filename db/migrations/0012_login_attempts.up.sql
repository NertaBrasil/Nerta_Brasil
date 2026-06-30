create table login_attempts (
  id          uuid primary key default gen_random_uuid(),
  ip          text        not null,
  email       text        not null,
  attempted_at timestamptz not null default now()
);

create index login_attempts_ip_attempted_at_idx
  on login_attempts (ip, attempted_at desc);

create index login_attempts_cleanup_idx
  on login_attempts (attempted_at);
