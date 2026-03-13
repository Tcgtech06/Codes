-- KnitInfo: form_submissions schema for Tasks 6-8
-- Safe to run multiple times.

create extension if not exists pgcrypto;

create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('add-data', 'advertise', 'collaborate')),
  form_data jsonb not null,
  attachments jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  review_notes text,
  submitted_at timestamptz not null default now(),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_form_submissions_type on public.form_submissions(type);
create index if not exists idx_form_submissions_status on public.form_submissions(status);
create index if not exists idx_form_submissions_submitted_at on public.form_submissions(submitted_at desc);
create index if not exists idx_form_submissions_type_status on public.form_submissions(type, status);

create or replace function public.set_updated_at_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_form_submissions_updated_at on public.form_submissions;
create trigger trg_form_submissions_updated_at
before update on public.form_submissions
for each row
execute function public.set_updated_at_timestamp();
