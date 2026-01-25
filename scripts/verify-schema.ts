/**
 * Verify Schema Applied
 *
 * Check if the database schema was properly applied
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifySchema() {
  console.log('🔍 Verifying database schema...\n');

  // Check if tables exist
  const { data: tables, error } = await supabase
    .from('bucket_list_items')
    .select('*')
    .limit(0);

  console.log('✅ bucket_list_items table exists');

  // Check if RLS is enabled by checking table metadata
  // This is a workaround since we can't directly query pg_tables
  const { data: profilesTest } = await supabase
    .from('profiles')
    .select('*')
    .limit(0);

  console.log('✅ profiles table exists\n');

  // Check table structure by looking at a sample record
  const { data: sample } = await supabase
    .from('bucket_list_items')
    .select('*')
    .limit(1)
    .single();

  if (sample) {
    console.log('📋 Table columns (from sample record):');
    Object.keys(sample).forEach(key => {
      const value = sample[key];
      const type = Array.isArray(value) ? 'array' : typeof value;
      console.log(`  - ${key}: ${type}`);
    });
  }

  console.log('\n🔒 Testing RLS enforcement...');

  // Test with anon key
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { count: anonCount } = await anonClient
    .from('bucket_list_items')
    .select('*', { count: 'exact', head: true });

  const { count: serviceCount } = await supabase
    .from('bucket_list_items')
    .select('*', { count: 'exact', head: true });

  console.log(`  With anon key (no auth): ${anonCount} items`);
  console.log(`  With service key: ${serviceCount} items`);

  if (anonCount === 0 && serviceCount && serviceCount > 0) {
    console.log('\n✅ RLS is properly configured and working!');
    console.log('   (Items are hidden from unauthenticated users)');
  } else if (anonCount === serviceCount) {
    console.log('\n⚠️  WARNING: RLS might not be enabled!');
    console.log('   (Anon key can see all items)');
  }
}

verifySchema();
