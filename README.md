# Abu Hassan Wedding Landing Page

React + Vite + TypeScript + Supabase — modular wedding landing page.

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Structure

```
src/
  app/              Routing, providers, shell
  config/           Wedding static config
  features/
    landing/        Main page sections
    naqoot/         Groom tipping + leaderboard
    admin/          Groom dashboard (uploads)
  lib/supabase/     Database & storage services
  styles/           Global CSS + design tokens
  types/            Shared TypeScript types
public/assets/      Static images, videos, fonts
supabase/           SQL schema
```

## Supabase setup

1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in SQL Editor
3. Create Storage bucket `gallery` (public read)
4. Create admin user (Auth → Users) for Mohammed
5. Copy `.env.example` → `.env.local` and add keys

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/naqoot` | Naqoot page + leaderboard |
| `/admin` | Groom admin panel |
