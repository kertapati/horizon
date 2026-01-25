/**
 * Check added_by field
 *
 * Check what user ID the items were added with
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAddedBy() {
  console.log('🔍 Checking added_by field...\n');

  // Get unique added_by values
  const { data, error } = await supabase
    .from('bucket_list_items')
    .select('added_by, title')
    .limit(5);

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log('Sample items:');
  data?.forEach((item, i) => {
    console.log(`  ${i + 1}. ${item.title}`);
    console.log(`     added_by: ${item.added_by || 'NULL'}`);
  });

  // Check current users
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

  if (!usersError && users) {
    console.log('\n📋 Users in system:');
    users.users.forEach(user => {
      console.log(`  - ${user.email} (${user.id})`);
    });
  }
}

checkAddedBy();
