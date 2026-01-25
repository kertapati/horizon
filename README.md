# Horizon - Life Architecture App

A shared bucket list and life planning PWA for couples. Organize and visualize your life goals across different categories and timeframes.

## Features

### Phase 1 (Implemented)
- ✅ Google OAuth authentication via Supabase
- ✅ Quick capture modal for adding items
- ✅ Comprehensive item details with multiple fields
- ✅ Filtering by category, location, status, and ownership
- ✅ Multiple view modes (All, Category, Location, Timeframe, Ownership)
- ✅ Item detail view with edit and delete
- ✅ Mark as complete flow with completion notes
- ✅ Mobile-responsive design
- ✅ PWA support (installable)

### Phase 2 (Future)
- Related items linking
- Trip planner view
- Visual dashboard/progress tracking
- Import tool for migrating existing notes
- AI insights

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase
- **Deployment:** Vercel
- **Language:** TypeScript

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API and copy your:
   - Project URL
   - Anon/Public key
3. Go to Authentication > Providers and enable Google OAuth:
   - Add your Google OAuth credentials
   - Configure authorized redirect URLs (will include your Vercel domain later)
4. Run the SQL schema:
   - Go to SQL Editor
   - Copy the contents of `supabase-schema.sql`
   - Execute it to create tables, policies, and triggers

### 2. Local Environment Setup

1. Clone the repository
2. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
3. Update `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000)

### 3. Vercel Deployment

1. Push your code to GitHub
2. Import the project to Vercel
3. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel domain)
4. Deploy
5. Update Supabase OAuth redirect URLs:
   - Go to Authentication > URL Configuration
   - Add redirect URL: `https://your-domain.vercel.app/auth/callback`

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Add authorized JavaScript origins:
   - `http://localhost:3000` (for local dev)
   - `https://your-domain.vercel.app` (for production)
   - Your Supabase project URL
6. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
7. Copy Client ID and Client Secret to Supabase Auth Provider settings

### 5. PWA Icons (Optional)

To make the PWA fully functional, add these icon files to the `public` folder:
- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)
- `icon-192-maskable.png` (192x192px with safe zone)
- `icon-512-maskable.png` (512x512px with safe zone)

You can use a tool like [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) to create these.

## Database Schema

### Tables

**profiles**
- User profile information (auto-created on signup)
- Fields: id, email, display_name

**bucket_list_items**
- Main bucket list items
- Extensive fields for categorization, location, timing, etc.
- See `types/database.ts` for complete schema

### Security

Row Level Security (RLS) is enabled on both tables. All authenticated users can:
- View all items (shared between couple)
- Create, update, and delete items
- Update their own profile

## Project Structure

```
horizon/
├── app/
│   ├── auth/callback/      # OAuth callback handler
│   ├── items/[id]/         # Item detail page
│   ├── login/              # Login page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── manifest.json       # PWA manifest
├── components/
│   ├── bucket-list.tsx     # Main list view with filters
│   ├── header.tsx          # App header
│   ├── item-detail.tsx     # Item detail/edit component
│   ├── quick-capture-button.tsx
│   └── quick-capture-modal.tsx
├── lib/
│   └── supabase/
│       ├── client.ts       # Client-side Supabase
│       ├── server.ts       # Server-side Supabase
│       └── middleware.ts   # Auth middleware
├── types/
│   └── database.ts         # TypeScript types
├── middleware.ts           # Next.js middleware
└── supabase-schema.sql     # Database schema
```

## Usage

### Adding Items

1. Click the **+** button (bottom right)
2. Enter a title (required)
3. Optionally expand "Add details" for:
   - Description
   - Categories (multi-select)
   - Location (Sydney/Australia/International)
   - Region (for international)
   - Physical activity flag
   - Actionability level
   - Target timeframe and year
   - Seasonality
   - Ownership (Couples/Peter/Wife)
   - Priority flag

### Viewing Items

- **All view:** See all items with filters
- **Category view:** Group by categories
- **Location view:** Group by location type
- **Timeframe view:** Group by when you plan to do them
- **Ownership view:** Filter by who owns the goal

### Filters

Use the dropdown filters to narrow down items by:
- Status (Idea, Planned, In Progress, Completed)
- Location type
- Ownership

### Managing Items

1. Click any item to view details
2. Edit to update any fields
3. Mark as complete to add completion notes
4. Delete with confirmation

## Customization

### Update "Wife" Label

The app currently uses "wife" as a placeholder. To customize:

1. Update the database enum in `supabase-schema.sql`:
   ```sql
   ownership TEXT DEFAULT 'couples' CHECK (ownership IN ('couples', 'peter', 'your_name'))
   ```
2. Update the TypeScript type in `types/database.ts`:
   ```typescript
   export type Ownership = 'couples' | 'peter' | 'your_name';
   ```
3. Update all component dropdown options

### Add More Categories

Edit the `CATEGORIES` array in `types/database.ts`

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## Troubleshooting

### OAuth Not Working

1. Verify Google OAuth credentials in Supabase
2. Check redirect URLs match exactly
3. Ensure `NEXT_PUBLIC_SITE_URL` is set correctly

### Database Errors

1. Verify RLS policies are in place
2. Check that the schema was executed successfully
3. Ensure user is authenticated

### PWA Not Installing

1. Verify manifest.json is accessible at `/manifest.json`
2. Add PWA icons to `/public` folder
3. Test on HTTPS (required for PWA)
4. Check browser console for manifest errors

## License

Private project for personal use.
