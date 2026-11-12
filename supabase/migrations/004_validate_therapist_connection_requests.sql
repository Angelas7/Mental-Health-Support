-- Ensure a patient can only request a connection with an account that is actually a therapist.
-- Apply after 003_appointment_permissions.sql.

drop policy if exists "patient_create_pending_access" on public.therapist_patient_access;

create policy "patient_create_pending_access" on public.therapist_patient_access
  for insert to authenticated
  with check (
    patient_id = (select auth.uid())
    and therapist_id <> (select auth.uid())
    and status = 'pending'
    and can_view_journal = false
    and can_view_mood = false
    and can_manage_homework = false
    and can_manage_appointments = false
    and exists (
      select 1
      from public.profiles therapist
      where therapist.id = therapist_patient_access.therapist_id
        and therapist.role = 'therapist'
    )
  );
