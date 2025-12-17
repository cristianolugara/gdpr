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
  contact_info text,
  dpa_status text default 'MISSING', -- 'SIGNED', 'MISSING', 'NOT_REQUIRED'
  dpa_document_id uuid references public.documents(id) on delete set null,
  security_assessment_status text default 'PENDING', -- 'APPROVED', 'REJECTED', 'PENDING'
  last_assessment_date timestamp with time zone,
  next_assessment_date timestamp with time zone,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS per Vendors
alter table public.gdpr_vendors enable row level security;
create policy "Users can view own vendors" on gdpr_vendors for select using ((select auth.uid()) = user_id);
create policy "Users can insert own vendors" on gdpr_vendors for insert with check ((select auth.uid()) = user_id);
create policy "Users can update own vendors" on gdpr_vendors for update using ((select auth.uid()) = user_id);
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
create policy "Users can view own training" on gdpr_training for select using ((select auth.uid()) = user_id);
create policy "Users can insert own training" on gdpr_training for insert with check ((select auth.uid()) = user_id);
create policy "Users can update own training" on gdpr_training for update using ((select auth.uid()) = user_id);
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
create policy "Users can view own audits" on gdpr_audit_logs for select using ((select auth.uid()) = user_id);
create policy "Users can insert own audits" on gdpr_audit_logs for insert with check ((select auth.uid()) = user_id);
create policy "Users can update own audits" on gdpr_audit_logs for update using ((select auth.uid()) = user_id);
create policy "Users can delete own audits" on gdpr_audit_logs for delete using ((select auth.uid()) = user_id);
