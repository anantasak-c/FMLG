-- Server-only, transactional boundary for a verified LINE identity. The caller
-- supplies an auth.users id created by the server after LINE verifies its ID
-- token; no browser-provided LINE user id is trusted by this function.

create or replace function public.claim_line_pilot_access(
  p_line_user_id text,
  p_owner_id uuid
)
returns table (
  is_allowlisted boolean,
  has_pilot_credit boolean,
  pilot_credit_granted boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing_owner_id uuid;
  allowlist_entry_id uuid;
  created_credit_id uuid;
begin
  if char_length(trim(p_line_user_id)) = 0 then
    raise exception 'LINE identity is required';
  end if;

  select user_id into existing_owner_id
    from public.line_identities
    where line_user_id = p_line_user_id
    for update;

  if existing_owner_id is not null and existing_owner_id <> p_owner_id then
    raise exception 'LINE identity is already linked to another account';
  end if;

  insert into public.line_identities (user_id, line_user_id)
    values (p_owner_id, p_line_user_id)
    on conflict (user_id) do update
      set line_user_id = excluded.line_user_id,
          updated_at = now();

  select id into allowlist_entry_id
    from public.pilot_allowlist
    where line_user_id = p_line_user_id
      and revoked_at is null;

  if allowlist_entry_id is null then
    return query select false, false, false;
    return;
  end if;

  insert into public.wallets (owner_id)
    values (p_owner_id)
    on conflict (owner_id) do nothing;

  insert into public.pilot_credits (owner_id, allowlist_id)
    values (p_owner_id, allowlist_entry_id)
    on conflict do nothing
    returning id into created_credit_id;

  return query
    select
      true,
      exists (
        select 1 from public.pilot_credits
        where owner_id = p_owner_id and allowlist_id = allowlist_entry_id
      ),
      created_credit_id is not null;
end;
$$;

revoke all on function public.claim_line_pilot_access(text, uuid) from public;
grant execute on function public.claim_line_pilot_access(text, uuid) to service_role;
