-- Serene Mind portal: initial PostgreSQL schema and row-level security.
-- Apply only to a fresh Supabase project after reviewing the policies.
-- Development and tests must use synthetic accounts/data.

create extension if not exists pgcrypto;

create type public.app_role as enum ('patient', 'therapist', 'platform_admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.app_role not null default 'patient',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- A patient explicitly approves a therapist and each data capability separately.
create table public.therapist_patient_access (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  therapist_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'active', 'revoked')),
  can_view_journal boolean not null default false,
  can_view_mood boolean not null default false,
  can_manage_homework boolean not null default false,
  can_manage_appointments boolean not null default false,
  approved_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (patient_id, therapist_id),
  check (patient_id <> therapist_id)
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mood_entries (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  mood text not null check (char_length(mood) <= 40),
  note text,
  recorded_at timestamptz not null default now()
);

create table public.homework (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  therapist_id uuid not null references public.profiles(id) on delete restrict,
  title text not null,
  instructions text not null default '',
  due_at timestamptz,
  status text not null default 'assigned' check (status in ('assigned', 'in_progress', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  therapist_id uuid not null references public.profiles(id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'cancelled', 'completed')),
  reminder_enabled boolean not null default true,
  reminder_sent_at timestamptz,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index therapist_access_patient_idx on public.therapist_patient_access(patient_id, status);
create index therapist_access_therapist_idx on public.therapist_patient_access(therapist_id, status);
create index journal_patient_created_idx on public.journal_entries(patient_id, created_at desc);
create index mood_patient_recorded_idx on public.mood_entries(patient_id, recorded_at desc);
create index homework_patient_due_idx on public.homework(patient_id, due_at);
create index appointments_patient_starts_idx on public.appointments(patient_id, starts_at);
create index appointments_therapist_starts_idx on public.appointments(therapist_id, starts_at);

-- Create a patient profile for each newly registered Auth user.
-- Privileged role changes must be performed by trusted server-side administration.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''), 'patient');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

alter table public.profiles enable row level security;
alter table public.therapist_patient_access enable row level security;
alter table public.journal_entries enable row level security;
alter table public.mood_entries enable row level security;
alter table public.homework enable row level security;
alter table public.appointments enable row level security;

-- Profiles: users can read their own profile. Role updates are not granted to clients.
create policy "profile_select_self" on public.profiles
  for select to authenticated using (id = (select auth.uid()));

-- Access grants: patient and therapist can inspect only their own relationship rows.
create policy "access_select_participants" on public.therapist_patient_access
  for select to authenticated
  using (patient_id = (select auth.uid()) or therapist_id = (select auth.uid()));

-- Patients may initiate a pending relationship request only for themselves.
create policy "patient_create_pending_access" on public.therapist_patient_access
  for insert to authenticated
  with check (
    patient_id = (select auth.uid())
    and status = 'pending'
    and can_view_journal = false
    and can_view_mood = false
    and can_manage_homework = false
    and can_manage_appointments = false
  );

-- Patient may revoke own grant; therapist cannot activate or expand their own access.
create policy "patient_revoke_access" on public.therapist_patient_access
  for update to authenticated
  using (patient_id = (select auth.uid()))
  with check (
    patient_id = (select auth.uid())
    and status = 'revoked'
    and can_view_journal = false
    and can_view_mood = false
    and can_manage_homework = false
    and can_manage_appointments = false
  );

-- Journal: patient owns rows; therapist reads only with active journal permission.
create policy "journal_patient_all" on public.journal_entries
  for all to authenticated
  using (patient_id = (select auth.uid()))
  with check (patient_id = (select auth.uid()));

create policy "journal_therapist_read_consented" on public.journal_entries
  for select to authenticated
  using (exists (
    select 1 from public.therapist_patient_access a
    where a.patient_id = journal_entries.patient_id
      and a.therapist_id = (select auth.uid())
      and a.status = 'active'
      and a.can_view_journal = true
  ));

create policy "mood_patient_all" on public.mood_entries
  for all to authenticated
  using (patient_id = (select auth.uid()))
  with check (patient_id = (select auth.uid()));

create policy "mood_therapist_read_consented" on public.mood_entries
  for select to authenticated
  using (exists (
    select 1 from public.therapist_patient_access a
    where a.patient_id = mood_entries.patient_id
      and a.therapist_id = (select auth.uid())
      and a.status = 'active'
      and a.can_view_mood = true
  ));

-- Homework: patient can read and update completion status on their own tasks.
create policy "homework_patient_read" on public.homework
  for select to authenticated using (patient_id = (select auth.uid()));

create policy "homework_patient_update" on public.homework
  for update to authenticated
  using (patient_id = (select auth.uid()))
  with check (patient_id = (select auth.uid()));

create policy "homework_therapist_read_assigned" on public.homework
  for select to authenticated
  using (therapist_id = (select auth.uid()) and exists (
    select 1 from public.therapist_patient_access a
    where a.patient_id = homework.patient_id
      and a.therapist_id = (select auth.uid())
      and a.status = 'active'
      and a.can_manage_homework = true
  ));

create policy "homework_therapist_create_assigned" on public.homework
  for insert to authenticated
  with check (therapist_id = (select auth.uid()) and exists (
    select 1 from public.therapist_patient_access a
    where a.patient_id = homework.patient_id
      and a.therapist_id = (select auth.uid())
      and a.status = 'active'
      and a.can_manage_homework = true
  ));

-- Appointments: both participants can read; therapist actions require an active grant.
create policy "appointment_patient_read" on public.appointments
  for select to authenticated using (patient_id = (select auth.uid()));

create policy "appointment_therapist_read_assigned" on public.appointments
  for select to authenticated
  using (therapist_id = (select auth.uid()) and exists (
    select 1 from public.therapist_patient_access a
    where a.patient_id = appointments.patient_id
      and a.therapist_id = (select auth.uid())
      and a.status = 'active'
      and a.can_manage_appointments = true
  ));

-- No client-side policy grants platform_admin blanket access to patient content.
-- Restrict client grants explicitly; privileged provisioning belongs in a trusted backend.
