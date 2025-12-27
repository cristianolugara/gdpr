-- Add role column to profiles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role text DEFAULT 'user';
    END IF;
END $$;

-- FIX: function_search_path_mutable
-- Explicitly set search_path to prevent malicious search path manipulation
create or replace function public.handle_new_user()
returns trigger
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql;

-- NOTE for 'auth_leaked_password_protection':
-- This setting must be enabled in the Supabase Dashboard:
-- Go to Authentication -> Security and enable "Detect leaked passwords" (Pwned Passwords).

-- Tabella Fornitori/Responsabili Esterni (GDPR Art. 28)
create table if not exists public.gdpr_vendors (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  service_type text, -- 'Hosting', 'Payroll', 'CRM', etc.
  vat_number text, -- P.IVA / CF
  contact_info text,
  pec text, -- PEC
  dpo_contact text, -- Nome e contatti DPO
  processing_category text, -- Categoria del trattamento
  business_function text, -- Funzione di business / Dip.
  sub_processors text, -- Sub-responsabili
  data_transfer_info text, -- Trasferimento dati extra UE
  security_measures_description text, -- Descrizione misure sicurezza
  dpa_status text default 'MISSING', -- 'SIGNED', 'MISSING', 'NOT_REQUIRED'
  dpa_document_id uuid references public.documents(id) on delete set null,
  security_assessment_status text default 'PENDING', -- 'APPROVED', 'REJECTED', 'PENDING'
  last_assessment_date timestamp with time zone,
  next_assessment_date timestamp with time zone,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add columns to gdpr_vendors if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gdpr_vendors' AND column_name = 'vat_number') THEN
        ALTER TABLE public.gdpr_vendors ADD COLUMN vat_number text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gdpr_vendors' AND column_name = 'pec') THEN
        ALTER TABLE public.gdpr_vendors ADD COLUMN pec text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gdpr_vendors' AND column_name = 'dpo_contact') THEN
        ALTER TABLE public.gdpr_vendors ADD COLUMN dpo_contact text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gdpr_vendors' AND column_name = 'processing_category') THEN
        ALTER TABLE public.gdpr_vendors ADD COLUMN processing_category text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gdpr_vendors' AND column_name = 'business_function') THEN
        ALTER TABLE public.gdpr_vendors ADD COLUMN business_function text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gdpr_vendors' AND column_name = 'sub_processors') THEN
        ALTER TABLE public.gdpr_vendors ADD COLUMN sub_processors text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gdpr_vendors' AND column_name = 'data_transfer_info') THEN
        ALTER TABLE public.gdpr_vendors ADD COLUMN data_transfer_info text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gdpr_vendors' AND column_name = 'security_measures_description') THEN
        ALTER TABLE public.gdpr_vendors ADD COLUMN security_measures_description text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gdpr_vendors' AND column_name = 'assessment_data') THEN
        ALTER TABLE public.gdpr_vendors ADD COLUMN assessment_data jsonb;
    END IF;
END $$;

-- RLS per Vendors
alter table public.gdpr_vendors enable row level security;
drop policy if exists "Users can view own vendors" on gdpr_vendors;
create policy "Users can view own vendors" on gdpr_vendors for select using ((select auth.uid()) = user_id);
drop policy if exists "Users can insert own vendors" on gdpr_vendors;
create policy "Users can insert own vendors" on gdpr_vendors for insert with check ((select auth.uid()) = user_id);
drop policy if exists "Users can update own vendors" on gdpr_vendors;
create policy "Users can update own vendors" on gdpr_vendors for update using ((select auth.uid()) = user_id);
drop policy if exists "Users can delete own vendors" on gdpr_vendors;
create policy "Users can delete own vendors" on gdpr_vendors for delete using ((select auth.uid()) = user_id);

-- Tabella Formazione Privacy (GDPR Art. 29, 32)
create table if not exists public.gdpr_training (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  date timestamp with time zone not null,
  duration_minutes integer,
  attendees text[] default '{}', -- List of names/emails
  materials_document_id uuid references public.documents(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS per Training
alter table public.gdpr_training enable row level security;
drop policy if exists "Users can view own training" on gdpr_training;
create policy "Users can view own training" on gdpr_training for select using ((select auth.uid()) = user_id);
drop policy if exists "Users can insert own training" on gdpr_training;
create policy "Users can insert own training" on gdpr_training for insert with check ((select auth.uid()) = user_id);
drop policy if exists "Users can update own training" on gdpr_training;
create policy "Users can update own training" on gdpr_training for update using ((select auth.uid()) = user_id);
drop policy if exists "Users can delete own training" on gdpr_training;
create policy "Users can delete own training" on gdpr_training for delete using ((select auth.uid()) = user_id);

-- Tabella Registri Controlli/Audit (Sicurezza, Backup, Annuali)
create table if not exists public.gdpr_audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null, -- 'SECURITY_CHECK', 'BACKUP_CHECK', 'ANNUAL_AUDIT', 'DPO_CHECK'
  status text not null, -- 'PASS', 'FAIL', 'WARNING'
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  performed_by text,
  notes text,
  next_check_date timestamp with time zone,
  evidence_document_id uuid references public.documents(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS per Audit Logs
alter table public.gdpr_audit_logs enable row level security;
drop policy if exists "Users can view own audits" on gdpr_audit_logs;
create policy "Users can view own audits" on gdpr_audit_logs for select using ((select auth.uid()) = user_id);
drop policy if exists "Users can insert own audits" on gdpr_audit_logs;
create policy "Users can insert own audits" on gdpr_audit_logs for insert with check ((select auth.uid()) = user_id);
drop policy if exists "Users can update own audits" on gdpr_audit_logs;
create policy "Users can update own audits" on gdpr_audit_logs for update using ((select auth.uid()) = user_id);
drop policy if exists "Users can delete own audits" on gdpr_audit_logs;
create policy "Users can delete own audits" on gdpr_audit_logs for delete using ((select auth.uid()) = user_id);

-- Tabella Company Settings (Dati Aziendali per Documenti)
create table if not exists public.companies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null, -- Ragione Sociale
  address text,
  city text,
  zip_code text,
  vat_number text,
  tax_code text,
  email text,
  pec text, -- PEC
  phone text,
  legal_representative text, -- Legale Rappresentante (per firme)
  dpo_name text, -- Nome DPO (opzionale)
  dpo_email text, -- Contatto DPO (opzionale)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint companies_user_id_key unique (user_id)
);

-- RLS per Companies
alter table public.companies enable row level security;
drop policy if exists "Users can view own company" on companies;
create policy "Users can view own company" on companies for select using ((select auth.uid()) = user_id);
drop policy if exists "Users can insert own company" on companies;
create policy "Users can insert own company" on companies for insert with check ((select auth.uid()) = user_id);
drop policy if exists "Users can update own company" on companies;
create policy "Users can update own company" on companies for update using ((select auth.uid()) = user_id);
drop policy if exists "Users can delete own company" on companies;
create policy "Users can delete own company" on companies for delete using ((select auth.uid()) = user_id);

-- Tabella Personale/Staff (Gestione Nomine e NDA - Doc 12)
create table if not exists public.gdpr_staff (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  first_name text not null,
  last_name text not null,
  email text,
  role text, -- Ruolo/Mansione
  employment_type text default 'INTERNAL', -- 'INTERNAL' (Dipendente), 'EXTERNAL' (Collaboratore), 'AUTONOMOUS' (Autonomo)
  is_system_admin boolean default false, -- Amministratore di Sistema
  is_privacy_ref boolean default false, -- Referente Privacy
  processing_allowance text, -- Operazioni di trattamento autorizzate
  appointment_date timestamp with time zone,
  has_signed_appointment boolean default false, -- Lettera di Nomina firmata?
  appointment_doc_id uuid references public.documents(id) on delete set null,
  has_signed_nda boolean default false, -- NDA firmato?
  nda_doc_id uuid references public.documents(id) on delete set null,
  status text default 'ACTIVE', -- 'ACTIVE', 'TERMINATED'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add columns if they don't exist (for existing tables)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gdpr_staff' AND column_name = 'is_system_admin') THEN
        ALTER TABLE public.gdpr_staff ADD COLUMN is_system_admin boolean DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gdpr_staff' AND column_name = 'is_privacy_ref') THEN
        ALTER TABLE public.gdpr_staff ADD COLUMN is_privacy_ref boolean DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gdpr_staff' AND column_name = 'processing_allowance') THEN
        ALTER TABLE public.gdpr_staff ADD COLUMN processing_allowance text;
    END IF;
END $$;

-- RLS per Staff
alter table public.gdpr_staff enable row level security;
drop policy if exists "Users can view own staff" on gdpr_staff;
create policy "Users can view own staff" on gdpr_staff for select using ((select auth.uid()) = user_id);
drop policy if exists "Users can insert own staff" on gdpr_staff;
create policy "Users can insert own staff" on gdpr_staff for insert with check ((select auth.uid()) = user_id);
drop policy if exists "Users can update own staff" on gdpr_staff;
create policy "Users can update own staff" on gdpr_staff for update using ((select auth.uid()) = user_id);
drop policy if exists "Users can delete own staff" on gdpr_staff;
create policy "Users can delete own staff" on gdpr_staff for delete using ((select auth.uid()) = user_id);
-- Tabella Valutazione d'Impatto (DPIA) - Art. 35 GDPR
-- Dal Manuale: Analisi dei rischi (Probabilità x Gravità) e necessità per trattamenti su larga scala/profilazione.

create table if not exists public.gdpr_dpia (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null, -- Nome del trattamento o progetto
  description text,
  
  -- Fattori di necessità (Screening)
  is_large_scale boolean default false,
  is_profiling boolean default false,
  is_public_monitoring boolean default false,
  is_mandatory boolean default false, -- Se true, la DPIA è obbligatoria
  
  -- Analisi del Rischio (Metodo Orizzontale/Verticale manuale)
  risk_description text,
  likelihood_score integer, -- 1-4 (Basso, Medio, Alto, Molto Alto)
  severity_score integer, -- 1-4
  risk_level text, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  
  -- Misure
  mitigation_measures text, -- Misure tecniche/organizzative per ridurre il rischio
  residual_risk_level text, -- Rischio residuo dopo misure
  
  -- Consultazioni
  dpo_opinion text, -- Parere del DPO
  
  status text default 'DRAFT', -- 'DRAFT', 'COMPLETED', 'REVIEWED'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS per DPIA
alter table public.gdpr_dpia enable row level security;
drop policy if exists "Users can view own dpia" on gdpr_dpia;
create policy "Users can view own dpia" on gdpr_dpia for select using ((select auth.uid()) = user_id);
drop policy if exists "Users can insert own dpia" on gdpr_dpia;
create policy "Users can insert own dpia" on gdpr_dpia for insert with check ((select auth.uid()) = user_id);
drop policy if exists "Users can update own dpia" on gdpr_dpia;
create policy "Users can update own dpia" on gdpr_dpia for update using ((select auth.uid()) = user_id);
drop policy if exists "Users can delete own dpia" on gdpr_dpia;
create policy "Users can delete own dpia" on gdpr_dpia for delete using ((select auth.uid()) = user_id);

