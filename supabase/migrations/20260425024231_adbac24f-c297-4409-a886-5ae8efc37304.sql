
alter function public.tg_set_updated_at() set search_path = public;

-- Explicit deny for end users on processed_emails (service role bypasses RLS)
create policy "processed_emails_no_user_access"
  on public.processed_emails
  for all
  to authenticated
  using (false)
  with check (false);
