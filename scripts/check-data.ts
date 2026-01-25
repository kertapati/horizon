/**
 * Check Bucket List Data
 *
 * Quick script to check how many items are in the database
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkData() {
  console.log('🔍 Checking database...\n');

  // Count total items
  const { count, error } = await supabase
    .from('bucket_list_items')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`📊 Total items in database: ${count}`);

  // Get sample items
  const { data: items } = await supabase
    .from('bucket_list_items')
    .select('title, status, ownership, categories')
    .limit(10);

  if (items && items.length > 0) {
    console.log('\n📝 Sample items:');
    items.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.title} (${item.status}, ${item.ownership})`);
    });
  }
}

checkData();
