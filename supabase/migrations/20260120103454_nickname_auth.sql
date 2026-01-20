-- Add nickname to profiles
alter table public.profiles add column nickname text;

-- Make it unique. 
-- Note: If there are existing rows with nulls, unique index allows multiple nulls unless standard SQL. Postgres allows multiple nulls in unique index.
-- But we want to enforce it for future users.
create unique index profiles_nickname_key on public.profiles (nickname);

-- RPC to get email from nickname (needed for login)
-- Security Definer is important so it can read profiles even if RLS somehow restricts (though public profiles are readable)
create or replace function public.get_email_by_nickname(query_nickname text)
returns text
security definer
set search_path = public
as $$
declare
  found_email text;
begin
  select email into found_email
  from public.profiles
  where nickname = query_nickname;
  
  return found_email;
end;
$$ language plpgsql;
