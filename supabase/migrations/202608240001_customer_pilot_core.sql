-- Closed customer-pilot ownership, Wallet, and private Generation Job model.
-- All privileged mutations (allowlisting, credits, Wallet ledger, provider jobs,
-- result assets, and notification delivery) run through server-side code using
-- the Supabase service role. Browser clients receive only owner-scoped access.

create extension if not exists pgcrypto;

do $$
begin
  create type public.generation_job_state as enum (
    'pending', 'processing', 'completed', 'failed', 'refunded', 'expired'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.generation_source_mode as enum (
    'text_to_video', 'image_to_video', 'video_upscale'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.generation_tier as enum (
    'economy', 'high_quality', 'upscale_2k'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.coin_ledger_kind as enum (
    'pilot_credit_grant', 'development_credit', 'top_up',
    'generation_debit', 'generation_refund'
  );
exception
  when duplicate_object then null;
end $$;

create table public.line_identities (
  user_id uuid primary key references auth.users(id) on delete cascade,
  line_user_id text not null unique check (char_length(trim(line_user_id)) > 0),
  linked_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pilot_allowlist (
  id uuid primary key default gen_random_uuid(),
  line_user_id text not null unique check (char_length(trim(line_user_id)) > 0),
  added_at timestamptz not null default now(),
  revoked_at timestamptz,
  note text,
  check (revoked_at is null or revoked_at >= added_at)
);

create table public.pilot_credits (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete restrict,
  allowlist_id uuid not null unique references public.pilot_allowlist(id) on delete restrict,
  granted_at timestamptz not null default now(),
  consumed_at timestamptz,
  consumed_by_generation_job_id uuid unique,
  check (consumed_at is null or consumed_at >= granted_at)
);

create table public.wallets (
  owner_id uuid primary key references auth.users(id) on delete restrict,
  coin_balance bigint not null default 0 check (coin_balance >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.coin_ledger_entries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete restrict,
  kind public.coin_ledger_kind not null,
  amount bigint not null check (amount <> 0),
  generation_job_id uuid,
  payment_reference text unique,
  idempotency_key text not null unique,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (
    (kind in ('pilot_credit_grant', 'development_credit', 'top_up', 'generation_refund') and amount > 0)
    or (kind = 'generation_debit' and amount < 0)
  )
);

create table public.source_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  storage_key text not null unique,
  media_type text not null,
  byte_size bigint not null check (byte_size > 0),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.generation_jobs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete restrict,
  creative_brief_id uuid references public.confirmed_creative_briefs(id) on delete set null,
  source_asset_id uuid references public.source_assets(id) on delete restrict,
  source_generation_job_id uuid references public.generation_jobs(id) on delete restrict,
  source_mode public.generation_source_mode not null,
  tier public.generation_tier not null,
  state public.generation_job_state not null default 'pending',
  provider_request_id text unique,
  provider_error_code text,
  coin_cost bigint not null default 0 check (coin_cost >= 0),
  is_private boolean not null default true,
  completed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (is_private),
  check (
    (source_mode = 'text_to_video' and source_asset_id is null and source_generation_job_id is null)
    or (source_mode = 'image_to_video' and source_asset_id is not null and source_generation_job_id is null)
    or (source_mode = 'video_upscale' and source_asset_id is null and source_generation_job_id is not null)
  ),
  check (
    (source_mode = 'text_to_video' and tier in ('economy', 'high_quality'))
    or (source_mode = 'image_to_video' and tier in ('economy', 'high_quality'))
    or (source_mode = 'video_upscale' and tier = 'upscale_2k')
  ),
  check (
    (completed_at is null and expires_at is null)
    or (completed_at is not null and expires_at = completed_at + interval '15 days')
  )
);

alter table public.pilot_credits
  add constraint pilot_credits_consumed_job_fkey
  foreign key (consumed_by_generation_job_id)
  references public.generation_jobs(id)
  on delete restrict;

alter table public.coin_ledger_entries
  add constraint coin_ledger_entries_generation_job_fkey
  foreign key (generation_job_id)
  references public.generation_jobs(id)
  on delete restrict;

create table public.result_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete restrict,
  generation_job_id uuid not null unique references public.generation_jobs(id) on delete restrict,
  storage_key text not null unique,
  media_type text not null,
  byte_size bigint not null check (byte_size > 0),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.generation_feedback (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  generation_job_id uuid not null unique references public.generation_jobs(id) on delete cascade,
  sentiment text not null check (sentiment in ('ตรงใจ', 'ยังไม่ตรงใจ')),
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((sentiment = 'ตรงใจ' and reason is null) or sentiment = 'ยังไม่ตรงใจ')
);

create table public.input_rights_confirmations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  is_first_generation_confirmation boolean not null default false,
  confirmed_at timestamptz not null default now(),
  policy_version text not null,
  source_asset_id uuid references public.source_assets(id) on delete set null
);

create unique index input_rights_confirmations_one_initial_confirmation
  on public.input_rights_confirmations(owner_id)
  where is_first_generation_confirmation;

create table public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete restrict,
  generation_job_id uuid not null references public.generation_jobs(id) on delete cascade,
  channel text not null check (channel = 'line_oa'),
  status text not null check (status in ('pending', 'sent', 'failed')),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  last_attempt_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.prompt_packages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete restrict,
  confirmed_creative_brief_id uuid references public.confirmed_creative_briefs(id) on delete set null,
  provider_profile text not null default 'flux3',
  package jsonb not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.studio_drafts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  prompt_package_id uuid not null references public.prompt_packages(id) on delete restrict,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index generation_jobs_owner_created_at_idx on public.generation_jobs(owner_id, created_at desc);
create index source_assets_owner_created_at_idx on public.source_assets(owner_id, created_at desc);
create index result_assets_owner_expires_at_idx on public.result_assets(owner_id, expires_at);
create index notification_deliveries_job_idx on public.notification_deliveries(generation_job_id, created_at desc);

create or replace function public.set_generation_job_completion_expiry()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.state = 'completed' and old.completed_at is null then
    new.completed_at := now();
    new.expires_at := new.completed_at + interval '15 days';
  end if;

  new.updated_at := now();
  return new;
end;
$$;

create trigger generation_jobs_set_completion_expiry
before insert or update of state on public.generation_jobs
for each row execute function public.set_generation_job_completion_expiry();

create or replace function public.enforce_result_asset_expiry()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  job_owner_id uuid;
  job_expiry timestamptz;
begin
  select owner_id, expires_at
    into job_owner_id, job_expiry
    from public.generation_jobs
    where id = new.generation_job_id;

  if job_owner_id is null or job_expiry is null then
    raise exception 'result asset requires a completed generation job';
  end if;

  if new.owner_id <> job_owner_id or new.expires_at <> job_expiry then
    raise exception 'result asset owner and expiry must match its generation job';
  end if;

  return new;
end;
$$;

create trigger result_assets_enforce_expiry
before insert or update of owner_id, generation_job_id, expires_at on public.result_assets
for each row execute function public.enforce_result_asset_expiry();

create or replace function public.prevent_coin_ledger_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'coin ledger entries are immutable';
end;
$$;

create trigger coin_ledger_entries_immutable
before update or delete on public.coin_ledger_entries
for each row execute function public.prevent_coin_ledger_mutation();

alter table public.line_identities enable row level security;
alter table public.pilot_allowlist enable row level security;
alter table public.pilot_credits enable row level security;
alter table public.wallets enable row level security;
alter table public.coin_ledger_entries enable row level security;
alter table public.source_assets enable row level security;
alter table public.generation_jobs enable row level security;
alter table public.result_assets enable row level security;
alter table public.generation_feedback enable row level security;
alter table public.input_rights_confirmations enable row level security;
alter table public.notification_deliveries enable row level security;
alter table public.prompt_packages enable row level security;
alter table public.studio_drafts enable row level security;

create policy "Owners can view their LINE identity"
  on public.line_identities for select using ((select auth.uid()) = user_id);

create policy "Owners can view their Pilot Credit"
  on public.pilot_credits for select using ((select auth.uid()) = owner_id);

create policy "Owners can view their Wallet"
  on public.wallets for select using ((select auth.uid()) = owner_id);

create policy "Owners can view their Coin ledger"
  on public.coin_ledger_entries for select using ((select auth.uid()) = owner_id);

create policy "Owners can view their source assets"
  on public.source_assets for select using ((select auth.uid()) = owner_id);
create policy "Owners can create their source assets"
  on public.source_assets for insert with check ((select auth.uid()) = owner_id);
create policy "Owners can update their source assets"
  on public.source_assets for update using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);
create policy "Owners can delete their source assets"
  on public.source_assets for delete using ((select auth.uid()) = owner_id);

create policy "Owners can view their Generation Jobs"
  on public.generation_jobs for select using ((select auth.uid()) = owner_id);

create policy "Owners can view their result assets"
  on public.result_assets for select using ((select auth.uid()) = owner_id);

create policy "Owners can view their feedback"
  on public.generation_feedback for select using ((select auth.uid()) = owner_id);
create policy "Owners can create their feedback"
  on public.generation_feedback for insert with check ((select auth.uid()) = owner_id);
create policy "Owners can update their feedback"
  on public.generation_feedback for update using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);
create policy "Owners can delete their feedback"
  on public.generation_feedback for delete using ((select auth.uid()) = owner_id);

create policy "Owners can view their rights confirmations"
  on public.input_rights_confirmations for select using ((select auth.uid()) = owner_id);
create policy "Owners can create their rights confirmations"
  on public.input_rights_confirmations for insert with check ((select auth.uid()) = owner_id);

create policy "Owners can view their notification deliveries"
  on public.notification_deliveries for select using ((select auth.uid()) = owner_id);

create policy "Owners can view their Prompt Packages"
  on public.prompt_packages for select using ((select auth.uid()) = owner_id);

create policy "Owners can view their Studio Drafts"
  on public.studio_drafts for select using ((select auth.uid()) = owner_id);
create policy "Owners can create their Studio Drafts"
  on public.studio_drafts for insert with check ((select auth.uid()) = owner_id);
create policy "Owners can update their Studio Drafts"
  on public.studio_drafts for update using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);
create policy "Owners can delete their Studio Drafts"
  on public.studio_drafts for delete using ((select auth.uid()) = owner_id);
