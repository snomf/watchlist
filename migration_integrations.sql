-- Create integrations table for storing OAuth tokens
create table public.integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  provider text not null check (provider in ('trakt')),
  access_token text not null,
  refresh_token text not null,
  expires_at bigint, -- Unix timestamp from Trakt
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint unique_user_provider unique(user_id, provider)
);

-- RLS Policies (Optional but good practice)
alter table public.integrations enable row level security;

create policy "Users can view their own integrations"
  on public.integrations for select
  using (true); -- Ideally filter by auth.uid() if using Supabase Auth, but we use custom auth logic in code for now.

-- Since we are doing logic in API/Frontend, we might just trust the API key for now if RLS is tricky with custom auth.
