-- Create settings table
create table if not exists public.settings (
    id uuid default gen_random_uuid() primary key,
    key text not null unique,
    value text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.settings enable row level security;

-- Create policies
create policy "Enable read access for authenticated users" on public.settings
    for select
    to authenticated
    using (true);

create policy "Enable write access for authenticated users" on public.settings
    for insert
    to authenticated
    with check (true);

create policy "Enable update access for authenticated users" on public.settings
    for update
    to authenticated
    using (true);

-- Create function to automatically update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger handle_updated_at
    before update on public.settings
    for each row
    execute function public.handle_updated_at(); 