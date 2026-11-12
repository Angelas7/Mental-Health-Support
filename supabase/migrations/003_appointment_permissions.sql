-- Appointment scheduling permissions: only a therapist with patient-approved
-- appointment-management permission may create or modify that patient's sessions.

create policy "appointment_therapist_create_consented" on public.appointments
  for insert to authenticated
  with check (
    therapist_id = (select auth.uid())
    and exists (
      select 1 from public.therapist_patient_access a
      where a.patient_id = appointments.patient_id
        and a.therapist_id = (select auth.uid())
        and a.status = 'active'
        and a.can_manage_appointments = true
    )
  );

create policy "appointment_therapist_update_consented" on public.appointments
  for update to authenticated
  using (
    therapist_id = (select auth.uid())
    and exists (
      select 1 from public.therapist_patient_access a
      where a.patient_id = appointments.patient_id
        and a.therapist_id = (select auth.uid())
        and a.status = 'active'
        and a.can_manage_appointments = true
    )
  )
  with check (
    therapist_id = (select auth.uid())
    and exists (
      select 1 from public.therapist_patient_access a
      where a.patient_id = appointments.patient_id
        and a.therapist_id = (select auth.uid())
        and a.status = 'active'
        and a.can_manage_appointments = true
    )
  );
