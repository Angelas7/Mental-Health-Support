-- Restrict trigger helper execution to trusted database triggers.
revoke all on function public.handle_new_auth_user() from public;
revoke all on function public.handle_new_auth_user() from anon;
revoke all on function public.handle_new_auth_user() from authenticated;

-- Consent RPCs are intentionally callable by signed-in patients only.
-- Each function checks auth.uid() and limits its UPDATE to that patient's own pending/active row.
revoke all on function public.patient_approve_therapist_access(uuid, boolean, boolean, boolean, boolean) from public;
revoke all on function public.patient_approve_therapist_access(uuid, boolean, boolean, boolean, boolean) from anon;
grant execute on function public.patient_approve_therapist_access(uuid, boolean, boolean, boolean, boolean) to authenticated;

revoke all on function public.patient_revoke_therapist_access(uuid) from public;
revoke all on function public.patient_revoke_therapist_access(uuid) from anon;
grant execute on function public.patient_revoke_therapist_access(uuid) to authenticated;
