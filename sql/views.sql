-- Create views table
create table if not exists public.views (
    id uuid default gen_random_uuid() primary key,
    page_path text not null,
    view_count integer default 0 not null,
    ip_address text,
    user_agent text,
    device_type text,
    browser text,
    os text,
    country text,
    city text,
    language text,
    referrer text,
    session_duration integer,
    is_unique boolean default true,
    is_mobile boolean,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.views enable row level security;

-- Create policies
create policy "Enable read access for authenticated users" on public.views
    for select
    to authenticated
    using (true);

create policy "Enable insert access for authenticated users" on public.views
    for insert
    to authenticated
    with check (true);

create policy "Enable update access for authenticated users" on public.views
    for update
    to authenticated
    using (true);

-- Create indexes
create index if not exists views_page_path_idx on public.views (page_path);
create index if not exists views_ip_address_idx on public.views (ip_address);
create index if not exists views_created_at_idx on public.views (created_at);
create index if not exists views_country_idx on public.views (country);
create index if not exists views_device_type_idx on public.views (device_type);

-- Create function to update updated_at on update
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger to update updated_at
create trigger handle_updated_at
    before update on public.views
    for each row
    execute procedure public.handle_updated_at(); 
