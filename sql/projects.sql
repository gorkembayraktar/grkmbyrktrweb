-- Projects tablosu
create table if not exists public.projects (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    image_url text,
    project_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Drop trigger if exists
drop trigger if exists handle_projects_updated_at on public.projects;

-- Create trigger
create trigger handle_projects_updated_at
    before update on public.projects
    for each row
    execute function public.handle_updated_at();

-- Enable RLS
alter table public.projects enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Everyone can view projects" on public.projects;
drop policy if exists "Authenticated users can insert projects" on public.projects;
drop policy if exists "Authenticated users can update projects" on public.projects;
drop policy if exists "Authenticated users can delete projects" on public.projects;

-- Create policies
create policy "Everyone can view projects"
    on public.projects
    for select
    using (true);

create policy "Authenticated users can insert projects"
    on public.projects
    for insert
    to authenticated
    with check (true);

create policy "Authenticated users can update projects"
    on public.projects
    for update
    to authenticated
    using (true);

create policy "Authenticated users can delete projects"
    on public.projects
    for delete
    to authenticated
    using (true); 