-- Index the therapist foreign key used by therapist-scoped homework queries.
create index if not exists homework_therapist_idx on public.homework(therapist_id);