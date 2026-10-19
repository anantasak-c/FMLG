create table public.ai_coach_consents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  policy_version text not null,
  consented_at timestamptz not null default now(),
  unique (owner_id, policy_version)
);

alter table public.ai_coach_consents enable row level security;

create policy "Owners can view their AI Coach consents"
  on public.ai_coach_consents for select using ((select auth.uid()) = owner_id);

create policy "Owners can create their AI Coach consents"
  on public.ai_coach_consents for insert with check ((select auth.uid()) = owner_id);
