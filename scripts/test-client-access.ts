/**
 * Test Client Access
 *
 * Test if we can read data using the anon key (like the frontend does)
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Create client with anon key (like the frontend)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAccess() {
  console.log('🔍 Testing client access (anon key)...\n');

  // Check auth status
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Auth session:', session ? '✅ Logged in' : '❌ Not logged in');

  // Try to fetch items
  const { data, error, count } = await supabase
    .from('bucket_list_items')
    .select('*', { count: 'exact' });

  if (error) {
    console.error('\n❌ Error fetching items:', error.message);
    console.error('Details:', error);
  } else {
    console.log(`\n✅ Successfully fetched ${count} items`);
    if (data && data.length > 0) {
      console.log('\nFirst 5 items:');
      data.slice(0, 5).forEach((item, i) => {
        console.log(`  ${i + 1}. ${item.title}`);
      });
    }
  }
}

testAccess();
