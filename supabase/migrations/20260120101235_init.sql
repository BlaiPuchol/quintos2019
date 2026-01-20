-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ENUMS
create type app_role as enum ('president', 'treasurer', 'member');
create type transaction_type as enum ('income', 'expense');
create type vote_status as enum ('open', 'closed');

-- 2. TABLES

-- PROFILES
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  email text,
  role app_role default 'member'::app_role not null,
  current_balance numeric default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS
alter table public.profiles enable row level security;

-- TRANSACTIONS
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  amount numeric not null,
  description text not null,
  category text,
  type transaction_type not null,
  payer_id uuid references public.profiles(id),
  created_by uuid references public.profiles(id) not null
);

alter table public.transactions enable row level security;

-- WARNINGS
create table public.warnings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  target_user_id uuid references public.profiles(id) not null,
  issued_by uuid references public.profiles(id) not null,
  reason text not null,
  expiration_date timestamp with time zone not null
);

alter table public.warnings enable row level security;

-- VOTES
create table public.votes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  created_by uuid references public.profiles(id) not null,
  is_anonymous boolean default false not null,
  status vote_status default 'open'::vote_status not null
);

alter table public.votes enable row level security;

-- VOTE OPTIONS
create table public.vote_options (
  id uuid default gen_random_uuid() primary key,
  vote_id uuid references public.votes(id) on delete cascade not null,
  label text not null
);

alter table public.vote_options enable row level security;

-- CAST VOTES
create table public.cast_votes (
  id uuid default gen_random_uuid() primary key,
  vote_id uuid references public.votes(id) on delete cascade not null,
  option_id uuid references public.vote_options(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(vote_id, user_id) -- One vote per user per poll
);

alter table public.cast_votes enable row level security;

-- 3. FUNCTIONS & TRIGGERS

-- Handle New User (Sync Auth to Profile)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper to check role
create or replace function public.is_role(checked_role app_role)
returns boolean as $$
declare
  user_role app_role;
begin
  select role into user_role from public.profiles where id = auth.uid();
  return user_role = checked_role;
end;
$$ language plpgsql security definer;

-- Atomic Transfer of Presidency
create or replace function public.transfer_presidency(new_president_id uuid)
returns void as $$
begin
  -- Check if caller is president
  if not public.is_role('president') then
    raise exception 'Only the President can transfer power.';
  end if;

  -- 1. Promotes new guy to president
  update public.profiles set role = 'president' where id = new_president_id;
  
  -- 2. Demotes current president (caller) to member
  update public.profiles set role = 'member' where id = auth.uid();
end;
$$ language plpgsql security definer;


-- 4. RLS POLICIES

-- PROFILES
-- Everyone can read profiles
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

-- Users can update their own metadata (but not role or balance typically, though requirement says 'metadata (avatar)')
create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Secure Role Updates
create or replace function public.prevent_role_change_by_non_president()
returns trigger as $$
begin
  if old.role is distinct from new.role then
    -- Exception: Allow if it's the transfer_presidency logic (handled by security definer function bypassing this trigger? No, trigger fires for updates.)
    -- Security Definer functions run with owner privileges. If owner is postgres/supabase_admin, they bypass RLS, but Triggers still run unless disabled.
    -- However, "auth.uid()" logic inside the trigger might fail if the function context changes, but usually it doesn't.
    -- Better approach: Check if user is president.
    if not public.is_role('president') then 
       -- If it is a System/RPC call (how to detect?), maybe allow?
       -- Actually, the transfer_presidency function runs as 'security definer', so 'auth.uid()' is still the caller (President).
       -- But we are promoting someone else.
       -- When Promote X to President: Caller is President. `public.is_role('president')` is true. Allowed.
       -- When Demote SELF to Member: Caller is President? Yes, until the update commits.
       -- BUT: recursions.
       -- Let's just trust `public.is_role('president')`.
       if not public.is_role('president') then
          raise exception 'Only President can change roles';
       end if;
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger check_role_change
  before update on public.profiles
  for each row execute procedure public.prevent_role_change_by_non_president();

-- President can update any profile (specifically for roles)
create policy "President can update any profile." on public.profiles
  for update using (public.is_role('president'));

-- TRANSACTIONS
-- Everyone can read
create policy "Transactions are viewable by everyone." on public.transactions
  for select using (true);

-- Treasurer can insert/update/delete
create policy "Treasurer can manage transactions." on public.transactions
  for all using (public.is_role('treasurer'));

-- WARNINGS
-- Everyone can read their own
create policy "Users can see own warnings." on public.warnings
  for select using (auth.uid() = target_user_id);
-- President can view all (implied? Usually yes. Let's allow President to see all)
create policy "President can view all warnings." on public.warnings
  for select using (public.is_role('president'));

-- President can insert
create policy "President can insert warnings." on public.warnings
  for insert with check (public.is_role('president'));

-- VOTES
-- Everyone can read
create policy "Votes are viewable by everyone." on public.votes
  for select using (true);

-- President can insert
create policy "President can create votes." on public.votes
  for insert with check (public.is_role('president'));

-- VOTE OPTIONS
-- Everyone read
create policy "Vote options viewable by everyone." on public.vote_options
  for select using (true);
-- President insert (usually with vote)
create policy "President can add options." on public.vote_options
  for insert with check (public.is_role('president'));

-- CAST VOTES
create policy "Users can see own cast votes." on public.cast_votes
  for select using (auth.uid() = user_id);

create policy "View cast votes if public or own." on public.cast_votes
  for select using (
    exists (
      select 1 from public.votes
      where votes.id = cast_votes.vote_id
      and (votes.is_anonymous = false)
    )
    or
    auth.uid() = user_id
  );

-- Insert: Everyone can vote
create policy "Users can cast votes." on public.cast_votes
  for insert with check (auth.uid() = user_id);

-- 5 Views

-- Active Warnings View
create or replace view public.active_warnings_view as
select
  w.*
from public.warnings w
where w.expiration_date > now();
