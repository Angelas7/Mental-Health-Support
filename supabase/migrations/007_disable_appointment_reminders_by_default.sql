-- Appointment reminders must be explicitly enabled; scheduling a session alone
-- must not opt a patient into reminder emails.
alter table public.appointments
  alter column reminder_enabled set default false;
