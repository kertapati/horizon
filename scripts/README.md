# Bucket List Seed Script

This script imports all bucket list items into the Supabase database.

## Setup

1. Make sure you have the required environment variables in your `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

   **Important:** The `SUPABASE_SERVICE_ROLE_KEY` is needed for admin operations. You can find this in your Supabase dashboard under Settings > API > service_role key.

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

## Running the Seed Script

### Method 1: Using npm script (Recommended)
```bash
npm run seed
```

### Method 2: Using npx directly
```bash
npx tsx scripts/seed-bucket-list.ts
```

## What the Script Does

1. **Loads all bucket list data** - 500+ items across multiple categories
2. **Deduplicates by title** - Merges duplicate items and combines categories
3. **Applies defaults**:
   - `status`: 'idea' (except completed items which have status: 'completed')
   - `ownership`: 'couples'
   - `is_priority`: false (except priority items)
   - `target_timeframe`: 'someday'
4. **Checks for existing items** - Skips items that already exist in the database
5. **Inserts new items** - Adds only new items to avoid duplicates

## Output

The script will log:
- ✅ Successfully inserted items
- ⏭️ Skipped items (already exist)
- ❌ Error items (failed to insert)
- 📊 Summary statistics

## Data Categories

The seed includes items from:
- Completed items (27 items)
- Priority items (7 items)
- Travel destinations (Europe, Asia, Americas, Middle East & Africa, Oceania)
- Cultural events
- Sporting events
- Music & party events
- Adventure activities (air, water, land)
- Personal growth
- Creative projects
- Skills to master
- Life & legacy goals
- Material goals
- Business & professional
- Social impact
- Health & wellness
- Food & drink experiences

## Troubleshooting

### Error: Missing environment variables
Make sure your `.env.local` file contains both `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

### Error: Permission denied
The script requires the service role key (not the anon key) to bypass RLS policies and insert data.

### Items not inserting
Check the console output for specific error messages. Common issues:
- Invalid data format
- Database schema mismatch
- Network connectivity issues

## Re-running the Script

The script is safe to run multiple times. It will:
- Skip items that already exist (matched by title)
- Only insert new items
- Never create duplicates

## Updating the Data

To add or modify items:
1. Edit the data arrays in `scripts/seed-bucket-list.ts`
2. Run the script again
3. New items will be added, existing items will be skipped
