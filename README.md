# Personal Portfolio Website

A modern and responsive portfolio website built with Next.js 15, TypeScript, and Tailwind CSS.

## Live Site

[https://gorkembayraktar.com/](https://gorkembayraktar.com/)

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

Next.js 15 App Router ve Supabase ile geliştirilmiş modern admin panel.

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
AUTHORIZED_EMAIL=your_email@example.com
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Veritabanı şemasını oluşturun:
   - `sql/` klasörü altındaki SQL dosyalarını sırasıyla çalıştırın:
     1. `profiles.sql` - Temel tabloları oluşturur
     2. `settings.sql` - Ayarlar tablosunu ve varsayılan değerleri ekler
     3. `posts.sql` -
     4. `categories.sql` -
     5. `projects.sql` -
     6. `views.sql` -
     7. `contacts.sql` -
   SQL dosyalarını çalıştırmak için:
   - Supabase Dashboard > SQL Editor bölümüne gidin
   - Her bir SQL dosyasının içeriğini kopyalayıp yapıştırın ve çalıştırın
   - Dosyaları sırasıyla çalıştırmaya dikkat edin


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
