-- Categories table
create table if not exists public.categories (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    slug text not null unique,
    description text,
    is_default boolean default false,
    parent_id uuid references public.categories(id) on delete restrict,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for parent_id
create index if not exists categories_parent_id_idx on public.categories(parent_id);

-- Post categories (many-to-many relationship)
create table if not exists public.post_categories (
    post_id uuid references public.posts(id) on delete cascade,
    category_id uuid references public.categories(id) on delete restrict,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (post_id, category_id)
);

-- Updated_at trigger for categories
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Drop trigger if exists
drop trigger if exists handle_categories_updated_at on public.categories;

-- Create trigger
create trigger handle_categories_updated_at
    before update on public.categories
    for each row
    execute function public.handle_updated_at();

-- Enable RLS
alter table public.categories enable row level security;
alter table public.post_categories enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Everyone can view categories" on public.categories;
drop policy if exists "Authenticated users can manage categories" on public.categories;
drop policy if exists "Everyone can view post categories" on public.post_categories;
drop policy if exists "Authenticated users can manage post categories" on public.post_categories;

-- Create policies
create policy "Everyone can view categories"
    on public.categories
    for select
    using (true);

create policy "Authenticated users can manage categories"
    on public.categories
    for all
    to authenticated
    using (true)
    with check (true);

create policy "Everyone can view post categories"
    on public.post_categories
    for select
    using (true);

create policy "Authenticated users can manage post categories"
    on public.post_categories
    for all
    to authenticated
    using (true);

-- Insert default category
insert into public.categories (name, slug, description, is_default)
values ('Genel', 'genel', 'Genel kategori', true)
on conflict (slug) do nothing;

-- Add constraint to ensure posts have at least one category
create or replace function public.ensure_post_has_category()
returns trigger as $$
begin
    if not exists (
        select 1 from public.post_categories
        where post_id = old.post_id
        and category_id != old.category_id
    ) then
        raise exception 'Posts must have at least one category';
    end if;
    return old;
end;
$$ language plpgsql;

-- Drop trigger if exists
drop trigger if exists ensure_post_has_category on public.post_categories;

-- Create trigger
create trigger ensure_post_has_category
    before delete on public.post_categories
    for each row
    execute function public.ensure_post_has_category(); 