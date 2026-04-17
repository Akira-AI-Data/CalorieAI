-- user_profiles: per-user settings data collected at onboarding
-- Apply in Supabase SQL editor: https://supabase.com/dashboard → SQL Editor

create table if not exists public.user_profiles (
  user_id        uuid primary key references public.users(id) on delete cascade,
  full_name      text not null,
  date_of_birth  date not null,
  gender         text not null,
  location       text,
  latitude       double precision,
  longitude      double precision,
  height_cm      numeric,
  weight_kg      numeric,
  age            integer,
  activity_level text default 'moderate',
  daily_calories integer default 2000,
  daily_protein  integer default 150,
  daily_carbs    integer default 250,
  daily_fat      integer default 65,
  daily_water    integer default 8,
  family_profiles jsonb default '[]'::jsonb,
  onboarded_at   timestamptz default now(),
  updated_at     timestamptz default now()
);

create index if not exists user_profiles_user_id_idx on public.user_profiles(user_id);

-- Auto-bump updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_profiles_set_updated_at on public.user_profiles;
create trigger user_profiles_set_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();
