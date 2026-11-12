-- Tighten client permissions and add patient-controlled consent actions.
-- Apply after 001_initial_schema.sql.

-- Remove broad row-level update policies where a client should change only a narrow field.
drop policy if exists "patient_revoke_access" on public.therapist_patient_access;
drop policy if exists "homework_patient_update" on public.homework;

-- A patient may update only homework completion status, not reassign tasks or rewrite instructions.
revoke update on public.homework from authenticated;
grant update (status) on public.homework to authenticated;

create policy "homework_patient_update_status" on public.homework
  for update to authenticated
  using (patient_id = (select auth.uid()))
  with check (patient_id = (select auth.uid()));

-- Consent changes happen through narrowly-scoped, patient-authenticated functions.
create or replace function public.patient_approve_therapist_access(
  p_access_id uuid,
  p_can_view_journal boolean default false,
  p_can_view_mood boolean default false,
  p_can_manage_homework boolean default false,
  p_can_manage_appointments boolean default false
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.therapist_patient_access
  set status = 'active',
      can_view_journal = p_can_view_journal,
      can_view_mood = p_can_view_mood,
      can_manage_homework = p_can_manage_homework,
      can_manage_appointments = p_can_manage_appointments,
      approved_at = now(),
      revoked_at = null
  where id = p_access_id
    and patient_id = (select auth.uid())
    and status = 'pending';

  if not found then
    raise exception 'Pending access request not found for this patient';
  end if;
end;
$$;

create or replace function public.patient_revoke_therapist_access(p_access_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.therapist_patient_access
  set status = 'revoked',
      can_view_journal = false,
      can_view_mood = false,
      can_manage_homework = false,
      can_manage_appointments = false,
      revoked_at = now()
  where id = p_access_id
    and patient_id = (select auth.uid())
    and status = 'active';

  if not found then
    raise exception 'Active access grant not found for this patient';
  end if;
end;
$$;

revoke all on function public.patient_approve_therapist_access(uuid, boolean, boolean, boolean, boolean) from public;
revoke all on function public.patient_revoke_therapist_access(uuid) from public;
grant execute on function public.patient_approve_therapist_access(uuid, boolean, boolean, boolean, boolean) to authenticated;
grant execute on function public.patient_revoke_therapist_access(uuid) to authenticated;
