# Personal Portfolio Website

A modern and responsive portfolio website built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🚀 Built with Next.js 15 App Router
- 💻 Fully Responsive Design
- 🎨 Modern UI with Tailwind CSS
- ✨ Smooth Animations with Framer Motion
- 📱 Mobile-First Approach
- 📝 Blog System with Categories
- 🔍 SEO Optimized
- 🌙 Dark Theme
- 📊 Statistics Section
- 💼 Project Showcase
- 📱 Contact Form
- 🔄 Dynamic Navigation

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** React Icons
- **Deployment:** Vercel

## Project Structure

```
├── app/
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── Projects.tsx
│   │   ├── About.tsx
│   │   ├── Blog.tsx
│   │   ├── Contact.tsx
│   │   └── ...
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx
│   └── page.tsx
├── public/
│   └── images/
├── styles/
│   └── globals.css
└── package.json
```
## Environment Setup

1. `.env.example` dosyasını `.env.local` olarak kopyalayın:
```bash
cp .env.example .env.local
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/gorkembayraktar/grkmbyrktrweb.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contact

For any inquiries, please reach out through the contact form on the website.

# Admin Panel

Next.js 13 App Router ve Supabase ile geliştirilmiş modern admin panel.

## Özellikler

- 🌙 Light/Dark tema desteği
- 🔐 Supabase Auth ile kimlik doğrulama
- 📱 Responsive tasarım
- ⚡ Hızlı ve modern arayüz

## Kurulum

1. Repoyu klonlayın
```bash
git clone https://github.com/yourusername/admin-panel.git
cd admin-panel
```

2. Bağımlılıkları yükleyin
```bash
npm install
```

3. `.env.local` dosyasını oluşturun
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Supabase veritabanı kurulumu
- Supabase projenizi oluşturun
- SQL Editor'de aşağıdaki SQL kodunu çalıştırın:

```sql
-- Settings tablosu ve ilgili yapılandırmalar
create table if not exists public.settings (
    id uuid default gen_random_uuid() primary key,
    key text not null unique,
    value text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS aktifleştirme
alter table public.settings enable row level security;

-- Politikalar
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

-- Updated_at için otomatik güncelleme fonksiyonu
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Updated_at trigger'ı
create trigger handle_updated_at
    before update on public.settings
    for each row
    execute function public.handle_updated_at();
```

5. Geliştirme sunucusunu başlatın
```bash
npm run dev
```

## Kullanım

1. `/login` sayfasından giriş yapın
2. Dashboard üzerinden site ayarlarını yönetin
3. Blog yazıları, kullanıcılar ve diğer içerikleri yönetin

## Lisans

MIT

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın
