-- Posts table
-- Posts tablosu
create table if not exists public.posts (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    slug text not null unique,
    content text,
    excerpt text,
    featured_image text,
    status text default 'draft' check (status in ('draft', 'published', 'trashed')),
    author_id uuid references public.profiles(id) on delete cascade,
    meta_title text,
    meta_description text,
    meta_keywords text,
    is_indexable boolean default true,
    canonical_url text,
    created_at timestamptz default timezone('utc'::text, now()),
    updated_at timestamptz default timezone('utc'::text, now()),
    published_at timestamptz,
    trashed_at timestamptz
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
drop trigger if exists handle_posts_updated_at on public.posts;

-- Create trigger
create trigger handle_posts_updated_at
    before update on public.posts
    for each row
    execute function public.handle_updated_at();

-- Enable RLS
alter table public.posts enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Everyone can view published posts" on public.posts;
drop policy if exists "Authenticated users can create posts" on public.posts;
drop policy if exists "Authenticated users can update own posts" on public.posts;
drop policy if exists "Authenticated users can delete own posts" on public.posts;

-- Create policies
create policy "Everyone can view published posts"
    on public.posts
    for select
    using ((status = 'published' and status != 'trashed') or auth.uid() = author_id);

create policy "Authenticated users can create posts"
    on public.posts
    for insert
    to authenticated
    with check (auth.uid() = author_id);

create policy "Authenticated users can update own posts"
    on public.posts
    for update
    to authenticated
    using (auth.uid() = author_id);

create policy "Authenticated users can delete own posts"
    on public.posts
    for delete
    to authenticated
    using (auth.uid() = author_id and status = 'trashed');

-- Post Categories tablosu
create table if not exists public.post_categories (
    post_id uuid references public.posts(id) on delete cascade,
    category_id uuid references public.categories(id) on delete restrict,
    created_at timestamptz default timezone('utc'::text, now()),
    primary key (post_id, category_id)
);

-- Enable RLS
alter table public.post_categories enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Everyone can view post categories" on public.post_categories;
drop policy if exists "Authenticated users can manage post categories" on public.post_categories;

-- Create policies
create policy "Everyone can view post categories"
    on public.post_categories
    for select
    using (true);

create policy "Authenticated users can manage post categories"
    on public.post_categories
    for all
    to authenticated
    using (
        exists (
            select 1 from public.posts
            where id = post_id
            and author_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from public.posts
            where id = post_id
            and author_id = auth.uid()
        )
    ); 