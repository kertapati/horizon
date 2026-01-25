/**
 * Test Anonymous Query
 *
 * Test what the anon key can actually see
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAnonQuery() {
  console.log('🔍 Testing anonymous query (like unauthenticated frontend)...\n');

  // Check auth
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Session:', session ? '✅ EXISTS' : '❌ NONE');

  // Try to query
  const { data, error, count } = await supabase
    .from('bucket_list_items')
    .select('*', { count: 'exact' });

  console.log('\nQuery result:');
  console.log(`  Status: ${error ? '❌ FAILED' : '✅ SUCCESS'}`);
  console.log(`  Count: ${count}`);
  console.log(`  Items returned: ${data?.length || 0}`);

  if (error) {
    console.log(`  Error: ${error.message}`);
    console.log(`  Code: ${error.code}`);
    console.log(`  Details: ${JSON.stringify(error.details)}`);
    console.log(`  Hint: ${error.hint}`);
  }

  if (data && data.length > 0) {
    console.log('\n  First 3 items:');
    data.slice(0, 3).forEach((item, i) => {
      console.log(`    ${i + 1}. ${item.title} (added_by: ${item.added_by})`);
    });
  }
}

testAnonQuery();
