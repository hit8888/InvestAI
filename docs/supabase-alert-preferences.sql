-- Alert preferences for retention/engagement prompts
-- Run this in Supabase SQL editor (one-time).

create table if not exists public.alert_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  daily_alert_enabled boolean not null default false,
  event_alert_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_alert_preferences_updated_at on public.alert_preferences;
create trigger trg_alert_preferences_updated_at
before update on public.alert_preferences
for each row execute function public.set_updated_at();

-- RLS (user can read/write their own row)
alter table public.alert_preferences enable row level security;

drop policy if exists "read own alert_preferences" on public.alert_preferences;
create policy "read own alert_preferences"
on public.alert_preferences
for select
using (auth.uid() = user_id);

drop policy if exists "upsert own alert_preferences" on public.alert_preferences;
create policy "upsert own alert_preferences"
on public.alert_preferences
for insert
with check (auth.uid() = user_id);

drop policy if exists "update own alert_preferences" on public.alert_preferences;
create policy "update own alert_preferences"
on public.alert_preferences
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

