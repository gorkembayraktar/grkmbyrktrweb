-- Create contacts table
create table if not exists public.contacts (
    id uuid default gen_random_uuid() primary key,
    fullname text not null,
    email text not null,
    phone text,
    message text not null,
    is_read boolean default false not null,
    read_date timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.contacts enable row level security;

-- Create policies
create policy "Enable read access for authenticated users" on public.contacts
    for select
    to authenticated
    using (true);

create policy "Enable insert access for all users" on public.contacts
    for insert
    to public
    with check (true);

create policy "Enable update access for authenticated users" on public.contacts
    for update
    to authenticated
    using (true);

create policy "Enable delete access for authenticated users" on public.contacts
    for delete
    to authenticated
    using (true);

-- Create indexes
create index if not exists contacts_created_at_idx on public.contacts (created_at desc);
create index if not exists contacts_email_idx on public.contacts (email);
create index if not exists contacts_is_read_idx on public.contacts (is_read);

-- Set up triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger handle_updated_at
    before update on public.contacts
    for each row
    execute function public.handle_updated_at(); 
