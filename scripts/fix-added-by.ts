/**
 * Fix added_by field
 *
 * Update all items to have the correct user ID
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAddedBy() {
  console.log('🔧 Fixing added_by field...\n');

  // Get the user
  const { data: users } = await supabase.auth.admin.listUsers();

  if (!users || users.users.length === 0) {
    console.error('❌ No users found in the system');
    return;
  }

  const user = users.users[0]; // Get first user (pkertapati@gmail.com)
  console.log(`👤 Using user: ${user.email} (${user.id})\n`);

  // Update all items with NULL added_by
  const { data, error } = await supabase
    .from('bucket_list_items')
    .update({ added_by: user.id })
    .is('added_by', null)
    .select();

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`✅ Updated ${data?.length || 0} items with added_by = ${user.id}`);
  console.log('\n🎉 All items are now associated with your account!');
}

fixAddedBy();
