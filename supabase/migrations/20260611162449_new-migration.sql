CREATE TYPE "public"."insured_gender" AS ENUM('MALE', 'FEMALE');--> statement-breakpoint
CREATE TYPE "public"."import_status" AS ENUM('queued', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "claim_records" (
                                 "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                                 "user_id" uuid NOT NULL,
                                 "import_id" uuid NOT NULL,
                                 "months_as_customer" integer NOT NULL,
                                 "age" integer NOT NULL,
                                 "policy_number" integer NOT NULL,
                                 "policy_bind_date" date NOT NULL,
                                 "policy_state" text NOT NULL,
                                 "policy_csl" text NOT NULL,
                                 "policy_deductable" integer NOT NULL,
                                 "policy_annual_premium" numeric(12, 2) NOT NULL,
                                 "umbrella_limit" integer NOT NULL,
                                 "insured_zip" integer NOT NULL,
                                 "insured_sex" "insured_gender" NOT NULL,
                                 "insured_education_level" text NOT NULL,
                                 "insured_occupation" text NOT NULL,
                                 "insured_hobbies" text NOT NULL,
                                 "insured_relationship" text NOT NULL,
                                 "capital_gains" integer NOT NULL,
                                 "capital_loss" integer NOT NULL,
                                 "incident_date" date NOT NULL,
                                 "incident_type" text NOT NULL,
                                 "collision_type" text NOT NULL,
                                 "incident_severity" text NOT NULL,
                                 "authorities_contacted" text NOT NULL,
                                 "incident_state" text NOT NULL,
                                 "incident_city" text NOT NULL,
                                 "incident_location" text NOT NULL,
                                 "incident_hour_of_the_day" integer NOT NULL,
                                 "number_of_vehicles_involved" integer NOT NULL,
                                 "property_damage" text NOT NULL,
                                 "bodily_injuries" integer NOT NULL,
                                 "witnesses" integer NOT NULL,
                                 "police_report_available" text NOT NULL,
                                 "total_claim_amount" numeric(12, 2) NOT NULL,
                                 "injury_claim" numeric(12, 2) NOT NULL,
                                 "property_claim" numeric(12, 2) NOT NULL,
                                 "vehicle_claim" numeric(12, 2) NOT NULL,
                                 "auto_make" text NOT NULL,
                                 "auto_model" text NOT NULL,
                                 "auto_year" integer NOT NULL,
                                 "fraud_reported" boolean DEFAULT false NOT NULL,
                                 "_c39" boolean DEFAULT false NOT NULL,
                                 "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imports" (
                           "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                           "user_id" uuid NOT NULL,
                           "file_name" text NOT NULL,
                           "status" "import_status" DEFAULT 'queued' NOT NULL,
                           "total_rows" integer DEFAULT 0 NOT NULL,
                           "processed_rows" integer DEFAULT 0 NOT NULL,
                           "failed_rows" integer DEFAULT 0 NOT NULL,
                           "error_summary" text,
                           "created_at" timestamp with time zone DEFAULT now() NOT NULL,
                           "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
                              "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                              "user_id" uuid NOT NULL,
                              "name" text NOT NULL,
                              "description" text,
                              "filters" jsonb NOT NULL,
                              "created_at" timestamp with time zone DEFAULT now() NOT NULL,
                              "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
