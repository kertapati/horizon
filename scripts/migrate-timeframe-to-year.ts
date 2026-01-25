/**
 * Migrate Timeframe to Year
 *
 * Converts target_timeframe to target_year field
 * - 'this_year' → 2026
 * - Everything else → NULL (unassigned)
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateTimeframeToYear() {
  console.log('🔄 Migrating target_timeframe to target_year...\n');

  // Get all items with 'this_year' timeframe
  const { data: thisYearItems } = await supabase
    .from('bucket_list_items')
    .select('id, title, target_timeframe')
    .eq('target_timeframe', 'this_year');

  if (thisYearItems && thisYearItems.length > 0) {
    console.log(`📅 Updating ${thisYearItems.length} items with 'this_year' to 2026...`);

    const { error } = await supabase
      .from('bucket_list_items')
      .update({ target_year: 2026 })
      .eq('target_timeframe', 'this_year');

    if (error) {
      console.error('❌ Error updating items:', error.message);
    } else {
      console.log('✅ Updated items to target_year: 2026');
    }
  } else {
    console.log('ℹ️  No items with "this_year" found');
  }

  // Check results
  const { data: yearItems, count } = await supabase
    .from('bucket_list_items')
    .select('target_year', { count: 'exact' })
    .not('target_year', 'is', null);

  console.log(`\n📊 Items with assigned years: ${count}`);

  const { data: unassignedItems, count: unassignedCount } = await supabase
    .from('bucket_list_items')
    .select('target_year', { count: 'exact' })
    .is('target_year', null);

  console.log(`📊 Unassigned items: ${unassignedCount}`);

  console.log('\n✨ Migration complete!');
}

migrateTimeframeToYear();
