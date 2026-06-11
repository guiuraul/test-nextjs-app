alter table public.portfolios enable row level security;
alter table public.portfolios force row level security;

drop policy if exists "portfolios_select_own" on public.portfolios;
create policy "portfolios_select_own"
on public.portfolios
for select
using (user_id = auth.uid());

drop policy if exists "portfolios_insert_own" on public.portfolios;
create policy "portfolios_insert_own"
on public.portfolios
for insert
with check (user_id = auth.uid());

drop policy if exists "portfolios_update_own" on public.portfolios;
create policy "portfolios_update_own"
on public.portfolios
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "portfolios_delete_own" on public.portfolios;
create policy "portfolios_delete_own"
on public.portfolios
for delete
using (user_id = auth.uid());

alter table public.imports enable row level security;
alter table public.imports force row level security;

drop policy if exists "imports_select_own" on public.imports;
create policy "imports_select_own"
on public.imports
for select
using (user_id = auth.uid());

drop policy if exists "imports_insert_own" on public.imports;
create policy "imports_insert_own"
on public.imports
for insert
with check (user_id = auth.uid());

drop policy if exists "imports_update_own" on public.imports;
create policy "imports_update_own"
on public.imports
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "imports_delete_own" on public.imports;
create policy "imports_delete_own"
on public.imports
for delete
using (user_id = auth.uid());

alter table public.claim_records enable row level security;
alter table public.claim_records force row level security;

drop policy if exists "claim_records_select_own" on public.claim_records;
create policy "claim_records_select_own"
on public.claim_records
for select
using (user_id = auth.uid());

drop policy if exists "claim_records_insert_own" on public.claim_records;
create policy "claim_records_insert_own"
on public.claim_records
for insert
with check (user_id = auth.uid());

drop policy if exists "claim_records_update_own" on public.claim_records;
create policy "claim_records_update_own"
on public.claim_records
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "claim_records_delete_own" on public.claim_records;
create policy "claim_records_delete_own"
on public.claim_records
for delete
using (user_id = auth.uid());
