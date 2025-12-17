-- Tabella Profiles (estende i dati utente di base)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  company_name text,
  updated_at timestamp with time zone
);

-- RLS per Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check ((select auth.uid()) = id);
create policy "Users can update their own profile." on public.profiles for update using ((select auth.uid()) = id);

-- Tabella Projects
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  url text,
  status text default 'Non conforme',
  privacy_score integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS per Projects
alter table public.projects enable row level security;
create policy "Users can view own projects" on projects for select using ((select auth.uid()) = user_id);
create policy "Users can insert own projects" on projects for insert with check ((select auth.uid()) = user_id);
create policy "Users can update own projects" on projects for update using ((select auth.uid()) = user_id);
create policy "Users can delete own projects" on projects for delete using ((select auth.uid()) = user_id);

-- Tabella Documents
create table if not exists public.documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  name text not null,
  type text not null, -- 'Informativa', 'Registro', 'Contratto'
  status text default 'Bozza', -- 'Completato', 'In Revisione', 'Bozza'
  content jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS per Documents
alter table public.documents enable row level security;
create policy "Users can view own documents" on documents for select using ((select auth.uid()) = user_id);
create policy "Users can insert own documents" on documents for insert with check ((select auth.uid()) = user_id);
create policy "Users can update own documents" on documents for update using ((select auth.uid()) = user_id);
create policy "Users can delete own documents" on documents for delete using ((select auth.uid()) = user_id);

-- Tabella Registro dei Trattamenti (Art. 30 GDPR)
create table if not exists public.gdpr_processing_activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  purpose text not null,
  legal_basis text not null, -- 'CONSENT', 'CONTRACT', etc.
  data_subjects text[] default '{}',
  data_categories text[] default '{}',
  data_categories_details text,
  recipients text[] default '{}',
  transfers_info jsonb default '{}'::jsonb, -- { isTransferred, countries, safeguards }
  retention_period text,
  security_measures text[] default '{}',
  status text default 'ACTIVE', -- 'ACTIVE', 'ARCHIVED', 'PLANNED'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS per Processing Activities
alter table public.gdpr_processing_activities enable row level security;
create policy "Users can view own activities" on gdpr_processing_activities for select using ((select auth.uid()) = user_id);
create policy "Users can insert own activities" on gdpr_processing_activities for insert with check ((select auth.uid()) = user_id);
create policy "Users can update own activities" on gdpr_processing_activities for update using ((select auth.uid()) = user_id);
create policy "Users can delete own activities" on gdpr_processing_activities for delete using ((select auth.uid()) = user_id);

-- Tabella Richieste Interessati (Art. 15-22 GDPR)
create table if not exists public.gdpr_subject_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null, -- 'ACCESS', 'RECTIFICATION', etc.
  status text default 'NEW', -- 'NEW', 'VERIFYING_IDENTITY', etc.
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

-- RLS per Subject Requests
alter table public.gdpr_subject_requests enable row level security;
create policy "Users can view own requests" on gdpr_subject_requests for select using ((select auth.uid()) = user_id);
create policy "Users can insert own requests" on gdpr_subject_requests for insert with check ((select auth.uid()) = user_id);
create policy "Users can update own requests" on gdpr_subject_requests for update using ((select auth.uid()) = user_id);
create policy "Users can delete own requests" on gdpr_subject_requests for delete using ((select auth.uid()) = user_id);

-- Tabella Data Breach (Art. 33-34 GDPR)
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
  risk_assessment jsonb default '{}'::jsonb, -- { rightsAndFreedoms, justification }
  actions_taken text[] default '{}',
  is_garante_notified boolean default false,
  garante_notification_date timestamp with time zone,
  is_subjects_notified boolean default false,
  status text default 'OPEN', -- 'OPEN', 'INVESTIGATING', 'RESOLVED', 'ARCHIVED'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS per Data Breaches
alter table public.gdpr_data_breaches enable row level security;
create policy "Users can view own breaches" on gdpr_data_breaches for select using ((select auth.uid()) = user_id);
create policy "Users can insert own breaches" on gdpr_data_breaches for insert with check ((select auth.uid()) = user_id);
create policy "Users can update own breaches" on gdpr_data_breaches for update using ((select auth.uid()) = user_id);
create policy "Users can delete own breaches" on gdpr_data_breaches for delete using ((select auth.uid()) = user_id);

-- Trigger per creazione automatica profilo
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

-- Rimuovi il trigger se esiste già per evitar duplicati in fase di sviluppo
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
