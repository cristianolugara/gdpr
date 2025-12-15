-- Esegui SOLO questa parte per aggiungere le nuove tabelle senza errori

-- 1. Tabella Registro dei Trattamenti
create table if not exists public.gdpr_processing_activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  purpose text not null,
  legal_basis text not null,
  data_subjects text[] default '{}',
  data_categories text[] default '{}',
  data_categories_details text,
  recipients text[] default '{}',
  transfers_info jsonb default '{}'::jsonb,
  retention_period text,
  security_measures text[] default '{}',
  status text default 'ACTIVE',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Policies per Registro (sicure da rieseguire se si droppano prima, ma qui usiamo Blocchi DO per sicurezza o semplicemente ignoriamo l'errore se esiste, ma meglio separare)
alter table public.gdpr_processing_activities enable row level security;

do $$ begin
  create policy "Users can view own activities" on gdpr_processing_activities for select using ((select auth.uid()) = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can insert own activities" on gdpr_processing_activities for insert with check ((select auth.uid()) = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can update own activities" on gdpr_processing_activities for update using ((select auth.uid()) = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can delete own activities" on gdpr_processing_activities for delete using ((select auth.uid()) = user_id);
exception when duplicate_object then null; end $$;


-- 2. Tabella Richieste Interessati
create table if not exists public.gdpr_subject_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  status text default 'NEW',
  requester_name text not null,
  requester_email text,
  request_date timestamp with time zone not null,
  deadline_date timestamp with time zone not null,
  is_identity_verified boolean default false,
  notes text,
  response_document_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.gdpr_subject_requests enable row level security;

do $$ begin
  create policy "Users can view own requests" on gdpr_subject_requests for select using ((select auth.uid()) = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can insert own requests" on gdpr_subject_requests for insert with check ((select auth.uid()) = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can update own requests" on gdpr_subject_requests for update using ((select auth.uid()) = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can delete own requests" on gdpr_subject_requests for delete using ((select auth.uid()) = user_id);
exception when duplicate_object then null; end $$;


-- 3. Tabella Data Breach
create table if not exists public.gdpr_data_breaches (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  detection_date timestamp with time zone not null,
  notification_deadline timestamp with time zone not null,
  description text not null,
  affected_data_categories text[] default '{}',
  affected_subjects_count integer,
  confidentiality_compromised boolean default false,
  integrity_compromised boolean default false,
  availability_compromised boolean default false,
  risk_assessment jsonb default '{}'::jsonb,
  actions_taken text[] default '{}',
  is_garante_notified boolean default false,
  garante_notification_date timestamp with time zone,
  is_subjects_notified boolean default false,
  status text default 'OPEN',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.gdpr_data_breaches enable row level security;

do $$ begin
  create policy "Users can view own breaches" on gdpr_data_breaches for select using ((select auth.uid()) = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can insert own breaches" on gdpr_data_breaches for insert with check ((select auth.uid()) = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can update own breaches" on gdpr_data_breaches for update using ((select auth.uid()) = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can delete own breaches" on gdpr_data_breaches for delete using ((select auth.uid()) = user_id);
exception when duplicate_object then null; end $$;
