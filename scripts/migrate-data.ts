/**
 * Safe Migration Script - Wrapper for seed-bucket-list.ts
 *
 * This script is a simple wrapper that:
 * 1. Validates your environment is ready for migration
 * 2. Runs the existing seed-bucket-list.ts logic
 * 3. Verifies the data arrived safely
 *
 * IMPORTANT: Your local data file (scripts/seed-bucket-list.ts) is NOT deleted.
 * It remains as a backup until you are 100% sure everything works.
 *
 * Run with: npx tsx scripts/migrate-data.ts
 *
 * After running, verify in Supabase Dashboard with:
 *   SELECT status, COUNT(*) FROM bucket_list_items GROUP BY status;
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('\n' + '═'.repeat(60));
console.log('  🌅 HORIZON - Safe Data Migration to Supabase');
console.log('═'.repeat(60) + '\n');

// Step 1: Validate environment
console.log('📋 Step 1: Validating environment...\n');

if (!supabaseUrl) {
  console.error('   ❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env.local');
  process.exit(1);
}
console.log('   ✓ NEXT_PUBLIC_SUPABASE_URL found');

if (!supabaseServiceKey) {
  console.error('   ❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env.local');
  console.error('     Add this from your Supabase Dashboard → Settings → API');
  process.exit(1);
}
console.log('   ✓ SUPABASE_SERVICE_ROLE_KEY found');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Step 2: Test connection
console.log('\n📡 Step 2: Testing Supabase connection...\n');

async function testConnection() {
  const { error } = await supabase
    .from('bucket_list_items')
    .select('id')
    .limit(1);

  if (error) {
    console.error('   ❌ Connection failed:', error.message);
    console.error('     Check your Supabase URL and keys');
    process.exit(1);
  }
  console.log('   ✓ Connection successful!');
}

// Step 3: Check current state
async function checkCurrentState() {
  console.log('\n📊 Step 3: Checking current database state...\n');

  const { count, error } = await supabase
    .from('bucket_list_items')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('   ❌ Failed to check database:', error.message);
    process.exit(1);
  }

  console.log(`   Current items in database: ${count || 0}`);

  if (count && count > 0) {
    console.log('\n   ⚠️  Database already contains items.');
    console.log('   The seed script will skip existing items (by title).');
    console.log('   No duplicates will be created.\n');
  }

  return count || 0;
}

// Step 4: Run the actual seed
async function runSeed() {
  console.log('\n🚀 Step 4: Running seed-bucket-list.ts...\n');
  console.log('─'.repeat(60) + '\n');

  // Import and run the seed script
  // This dynamically imports the existing seed file
  try {
    await import('./seed-bucket-list');
  } catch (error) {
    console.error('   ❌ Failed to run seed script:', error);
    process.exit(1);
  }
}

// Step 5: Verify results
async function verifyResults(previousCount: number) {
  // Wait a moment for the seed to finish
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('\n' + '─'.repeat(60));
  console.log('\n📋 Step 5: Verifying migration results...\n');

  // Count total items
  const { count: newCount, error: countError } = await supabase
    .from('bucket_list_items')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('   ❌ Failed to verify:', countError.message);
    return;
  }

  // Get status breakdown
  const { data: statusData, error: statusError } = await supabase
    .from('bucket_list_items')
    .select('status');

  if (statusError) {
    console.error('   ❌ Failed to get status breakdown:', statusError.message);
    return;
  }

  const statusCounts = statusData?.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  console.log('   📊 Migration Summary:');
  console.log(`      Total items now in database: ${newCount}`);
  console.log(`      Items added this run: ${(newCount || 0) - previousCount}`);
  console.log('\n   📈 Items by Status:');
  Object.entries(statusCounts).forEach(([status, count]) => {
    console.log(`      ${status}: ${count}`);
  });

  // Get priority count
  const { count: priorityCount } = await supabase
    .from('bucket_list_items')
    .select('*', { count: 'exact', head: true })
    .eq('is_priority', true);

  console.log(`\n   ⭐ Priority items: ${priorityCount || 0}`);
}

// Main execution
async function main() {
  await testConnection();
  const previousCount = await checkCurrentState();

  console.log('\n' + '═'.repeat(60));
  console.log('  Starting Migration...');
  console.log('═'.repeat(60));

  await runSeed();
  await verifyResults(previousCount);

  console.log('\n' + '═'.repeat(60));
  console.log('  ✅ Migration Complete!');
  console.log('═'.repeat(60));
  console.log('\n💡 Your local data file remains intact as a backup:');
  console.log('   scripts/seed-bucket-list.ts');
  console.log('\n📝 To verify in Supabase Dashboard, run this SQL:');
  console.log('   SELECT status, COUNT(*) as count');
  console.log('   FROM bucket_list_items');
  console.log('   GROUP BY status;');
  console.log('\n🔄 To enable Supabase in the app, set:');
  console.log('   NEXT_PUBLIC_USE_SUPABASE=true');
  console.log('   in your .env.local file\n');
}

main().catch(error => {
  console.error('\n💥 Migration failed:', error);
  process.exit(1);
});
