/**
 * Validates a local datetime range before a therapist schedules an appointment.
 * Inputs are datetime-local strings; Date parses them in the browser's local timezone.
 */
export function isFutureAppointmentRange(startValue, endValue, now = Date.now()) {
  const startsAt = new Date(startValue).getTime();
  const endsAt = new Date(endValue).getTime();

  return Number.isFinite(startsAt)
    && Number.isFinite(endsAt)
    && startsAt > now
    && endsAt > startsAt;
}
