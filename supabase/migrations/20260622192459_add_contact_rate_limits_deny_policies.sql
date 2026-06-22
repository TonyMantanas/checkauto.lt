drop policy if exists "No anon contact rate limit access" on public.contact_rate_limits;
drop policy if exists "No authenticated contact rate limit access" on public.contact_rate_limits;

create policy "No anon contact rate limit access"
  on public.contact_rate_limits
  for all
  to anon
  using (false)
  with check (false);

create policy "No authenticated contact rate limit access"
  on public.contact_rate_limits
  for all
  to authenticated
  using (false)
  with check (false);
