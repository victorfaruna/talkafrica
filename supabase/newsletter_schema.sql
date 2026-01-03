-- Create the table for storing newsletter subscribers
create table if not exists newsletter_subscribers (
  id bigint primary key generated always as identity,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table newsletter_subscribers enable row level security;

-- Create a policy that allows anyone to insert their email (anon key)
create policy "Enable insert for anyone" 
on newsletter_subscribers for insert 
with check (true);

-- Create a policy that allows only service_role (admins) to select/view emails
create policy "Enable read for service_role only" 
on newsletter_subscribers for select 
using (auth.role() = 'service_role');
