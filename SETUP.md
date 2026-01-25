# Quick Setup Guide

Follow these steps to get Horizon running:

## 1. Supabase Setup (5 minutes)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to **SQL Editor**, paste contents of `supabase-schema.sql`, and run it
4. Go to **Authentication > Providers**, enable Google
5. Copy your **Project URL** and **Anon Key** from **Project Settings > API**

## 2. Google OAuth (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
6. Copy Client ID and Secret to Supabase Auth Provider settings

## 3. Local Environment

```bash
# Clone and install
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local with your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Run dev server
npm run dev
```

Visit http://localhost:3000 and sign in with Google.

## 4. Deploy to Vercel (5 minutes)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel URL)
4. Deploy
5. Update Supabase redirect URLs with your Vercel domain

## Done!

You now have a fully functional life planning app. Start adding your bucket list items!

For detailed documentation, see [README.md](README.md)
