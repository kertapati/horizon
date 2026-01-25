/**
 * Check RLS Policies
 *
 * Verify that RLS policies are correctly configured
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRLS() {
  console.log('🔍 Checking RLS policies...\n');

  // Check if RLS is enabled
  const { data: tables, error } = await supabase
    .rpc('pg_tables')
    .select('*')
    .eq('schemaname', 'public');

  // Query the policies directly
  const { data: policies } = await supabase
    .from('pg_policies')
    .select('*')
    .eq('schemaname', 'public')
    .eq('tablename', 'bucket_list_items');

  if (policies) {
    console.log('📋 Policies for bucket_list_items:');
    policies.forEach(policy => {
      console.log(`  - ${policy.policyname}`);
      console.log(`    Command: ${policy.cmd}`);
      console.log(`    Roles: ${policy.roles}`);
    });
  } else {
    console.log('Checking via SQL...');

    const { data, error: sqlError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
        FROM pg_policies
        WHERE tablename = 'bucket_list_items';
      `
    });

    if (sqlError) {
      console.error('Cannot query policies directly. Checking table info instead...');

      // Try a simpler approach - just test if we can query as anon
      const anonClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data: testData, error: testError } = await anonClient
        .from('bucket_list_items')
        .select('count')
        .limit(1);

      console.log('\n🧪 Test query with anon key (no auth):');
      console.log(`  Result: ${testError ? 'FAILED' : 'SUCCESS'}`);
      if (testError) {
        console.log(`  Error: ${testError.message}`);
        console.log(`  Hint: ${testError.hint}`);
      }
    }
  }
}

checkRLS();
