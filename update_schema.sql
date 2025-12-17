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
