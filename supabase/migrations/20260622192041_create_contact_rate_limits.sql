create extension if not exists pg_cron with schema extensions;

create table if not exists public.contact_rate_limits (
  id bigserial primary key,
  scope text not null check (
    scope in ('ip_10m', 'ip_24h', 'email_24h', 'phone_24h', 'global_24h')
  ),
  identifier_hash text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_rate_limits enable row level security;

revoke all on table public.contact_rate_limits from anon, authenticated;
revoke all on sequence public.contact_rate_limits_id_seq from anon, authenticated;

grant select, insert, delete on table public.contact_rate_limits to service_role;
grant usage, select on sequence public.contact_rate_limits_id_seq to service_role;

create index if not exists contact_rate_limits_lookup_idx
  on public.contact_rate_limits (scope, identifier_hash, created_at desc);

create index if not exists contact_rate_limits_created_at_idx
  on public.contact_rate_limits (created_at);

create or replace function public.check_contact_rate_limit(
  p_ip_hash text,
  p_email_hash text,
  p_phone_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_now timestamptz := now();
  v_scope text;
  v_identifier_hash text;
  v_window interval;
  v_limit integer;
  v_count integer;
  v_oldest timestamptz;
  v_retry_after integer;
begin
  perform pg_advisory_xact_lock(hashtext('contact_rate_limits'));

  for v_scope, v_identifier_hash, v_window, v_limit in
    values
      ('ip_10m', p_ip_hash, interval '10 minutes', 3),
      ('ip_24h', p_ip_hash, interval '24 hours', 20),
      ('email_24h', p_email_hash, interval '24 hours', 3),
      ('phone_24h', p_phone_hash, interval '24 hours', 3),
      ('global_24h', 'global', interval '24 hours', 100)
  loop
    select count(*), min(created_at)
      into v_count, v_oldest
    from public.contact_rate_limits
    where scope = v_scope
      and identifier_hash = v_identifier_hash
      and created_at >= v_now - v_window;

    if v_count >= v_limit then
      v_retry_after := greatest(1, ceil(extract(epoch from ((v_oldest + v_window) - v_now)))::integer);

      return jsonb_build_object(
        'allowed', false,
        'scope', v_scope,
        'retry_after_seconds', v_retry_after
      );
    end if;
  end loop;

  insert into public.contact_rate_limits (scope, identifier_hash)
  values
    ('ip_10m', p_ip_hash),
    ('ip_24h', p_ip_hash),
    ('email_24h', p_email_hash),
    ('phone_24h', p_phone_hash),
    ('global_24h', 'global');

  return jsonb_build_object(
    'allowed', true,
    'scope', null,
    'retry_after_seconds', 0
  );
end;
$$;

revoke all on function public.check_contact_rate_limit(text, text, text) from public, anon, authenticated;
grant execute on function public.check_contact_rate_limit(text, text, text) to service_role;

select cron.schedule(
  'cleanup-contact-rate-limits',
  '17 * * * *',
  $$
    delete from public.contact_rate_limits
    where created_at < now() - interval '25 hours';
  $$
);
