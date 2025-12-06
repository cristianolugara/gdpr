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

-- Trigger per creazione automatica profilo
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Rimuovi il trigger se esiste già per evitar duplicati in fase di sviluppo
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- INSERT DATA DI ESEMPIO (Opzionale, scommentare per popolare)
-- Verificare prima di avere un utente loggato e usare il suo ID, altrimenti l'insert fallisce per vincoli FK
