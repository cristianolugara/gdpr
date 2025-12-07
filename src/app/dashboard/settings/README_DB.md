# Database Setup for Company Settings

Per far funzionare la pagina "Impostazioni Aziendali", è necessaria una tabella `companies` nel database Supabase.

Esegui questo script nell'SQL Editor di Supabase:

```sql
-- Create companies table
create table if not exists public.companies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  address text,
  city text,
  zip_code text,
  vat_number text,
  tax_code text,
  email text,
  pec text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint companies_user_id_key unique (user_id)
);

-- Enable RLS
alter table public.companies enable row level security;

-- Create Policies
create policy "Users can view their own company" on public.companies
  for select using (auth.uid() = user_id);

create policy "Users can insert their own company" on public.companies
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own company" on public.companies
  for update using (auth.uid() = user_id);
```
