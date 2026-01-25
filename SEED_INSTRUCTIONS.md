# 🌱 Seed Your Bucket List Data

This guide will help you import your comprehensive bucket list (500+ items) into the Horizon app database.

## Prerequisites

1. **Get your Supabase Service Role Key**:
   - Go to your Supabase dashboard: https://supabase.com/dashboard
   - Select your project
   - Go to **Settings** > **API**
   - Copy the `service_role` key (NOT the anon key)
   - ⚠️ **Important:** Keep this key secure! It bypasses Row Level Security.

2. **Add the key to your environment variables**:
   - Open `/horizon/.env.local`
   - Add this line:
     ```
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
     ```
   - Save the file

## Running the Seed

### Option 1: Quick Start (Recommended)
```bash
cd horizon
npm install  # Install dependencies (including tsx)
npm run seed
```

### Option 2: Direct Command
```bash
cd horizon
npx tsx scripts/seed-bucket-list.ts
```

## What Gets Imported

The seed script will import **500+ bucket list items** including:

### ✅ Completed Items (27)
- Vietnam, Italy, Portugal, Paris, London, Amsterdam, Berlin
- Grand Prix, Tomorrowland, Taylor Swift concert, Fred Again concert
- And more...

### ⭐ Priority Items (7)
- Inca Trail + Machu Picchu
- Yosemite National Park
- Northern Lights
- Burning Man
- NBA Playoffs
- Mexico Day of the Dead
- PokéPark Kanto

### 🌍 Travel Destinations (300+)
- **Europe**: Italy, Switzerland, France, UK, Greece, Spain, Nordics, Balkans
- **Asia**: Japan, China, Vietnam, Thailand, India, Nepal
- **Americas**: USA, Canada, Mexico, Brazil, Peru, Argentina
- **Middle East & Africa**: Dubai, Jordan, South Africa, Tanzania
- **Oceania**: New Zealand, Australia, Antarctica, Pacific Islands

### 🎯 Activities & Experiences (200+)
- Sporting events (marathons, F1, NBA, Olympics)
- Music & festivals (Coachella, EDC, Wonderfruit)
- Adventure activities (skydiving, surfing, snowboarding)
- Cultural events (Art Basel, Fashion Week, festivals)
- Personal growth (retreats, courses, challenges)
- Creative projects (DJing, painting, filmmaking)
- Skills to master (golf, Mandarin, cooking, DJing)
- Life & legacy goals
- Material goals
- Business & professional

## Expected Output

When you run the script, you'll see:
```
🌱 Starting bucket list seed...

📊 Total items to process: 564
✨ Unique items after deduplication: 537

✅ Inserted "Inca Trail + Machu Picchu"
✅ Inserted "Northern Lights"
✅ Inserted "Lake Como"
...

🎉 Seed completed!
   ✅ Inserted: 537
   ⏭️  Skipped: 0
   ❌ Errors: 0
   📊 Total: 537/537

✨ All done!
```

## Safe to Re-run

The script is **idempotent** - you can run it multiple times:
- ✅ It will skip items that already exist (matched by title)
- ✅ It will only insert new items
- ✅ It will never create duplicates

## Verifying the Data

After seeding, you can verify the data:

1. **Check item count** in your app
2. **View by category** - items are tagged with categories like "travel", "adventure", "sporting_events"
3. **Filter by status** - completed items have `status: 'completed'`
4. **Check priorities** - priority items have `is_priority: true`

## Troubleshooting

### ❌ Error: "Missing required environment variables"
- Make sure you've added `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
- Restart your terminal after adding the key

### ❌ Error: "Permission denied" or RLS policy errors
- The seed script needs the **service role key**, not the anon key
- Double-check you copied the correct key from Supabase dashboard

### ❌ Error: "Cannot find module 'tsx'"
- Run `npm install` first to install all dependencies

### ⚠️ Some items failed to insert
- Check the console output for specific error messages
- Common causes: invalid data format, schema mismatch
- The script will continue and report which items failed

## Next Steps

After seeding:
1. Log in to your app
2. Browse your bucket list items
3. Start planning your adventures!
4. Mark items as completed as you achieve them

## Need Help?

- Check the detailed logs in the console output
- Review the seed script: `scripts/seed-bucket-list.ts`
- Review the data structure in the script to understand what's being imported

---

**Note**: This is a one-time import. Once your data is seeded, you can manage all items through the Horizon app interface.
