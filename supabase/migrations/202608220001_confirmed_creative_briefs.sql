create table public.confirmed_creative_briefs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  creative_brief jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.confirmed_creative_briefs enable row level security;

create policy "Owners can view their confirmed creative briefs"
  on public.confirmed_creative_briefs for select
  using ((select auth.uid()) = owner_id);

create policy "Owners can create their confirmed creative briefs"
  on public.confirmed_creative_briefs for insert
  with check ((select auth.uid()) = owner_id);

create policy "Owners can update their confirmed creative briefs"
  on public.confirmed_creative_briefs for update
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "Owners can delete their confirmed creative briefs"
  on public.confirmed_creative_briefs for delete
  using ((select auth.uid()) = owner_id);
