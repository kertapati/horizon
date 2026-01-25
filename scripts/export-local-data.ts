/**
 * Export Supabase Data to Local File
 *
 * This script exports your current Supabase data to the local-data.ts file,
 * keeping your local backup up-to-date.
 *
 * Run with: npx tsx scripts/export-local-data.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportData() {
  console.log('Fetching data from Supabase...\n');

  const { data, error } = await supabase
    .from('bucket_list_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch data:', error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log('No data found in Supabase.');
    process.exit(0);
  }

  console.log(`Found ${data.length} items. Generating local-data.ts...\n`);

  // Generate the TypeScript file content
  const fileContent = `/**
 * Local Bucket List Data - Fallback when Supabase is unavailable
 *
 * This file contains a snapshot of your bucket list data.
 * It serves as a backup when:
 * - NEXT_PUBLIC_USE_SUPABASE is not set to "true"
 * - Supabase connection fails
 *
 * IMPORTANT: This file is NOT deleted during migration.
 * Keep it as a safety net until you're 100% confident in Supabase.
 *
 * Last exported: ${new Date().toISOString()}
 * Total items: ${data.length}
 *
 * To update this file with fresh data from Supabase, run:
 *   npx tsx scripts/export-local-data.ts
 */

import { BucketListItem } from '@/types/database';

/**
 * Local bucket list data
 * This is a snapshot of your data that can be used as a fallback
 */
export const localBucketListData: BucketListItem[] = ${JSON.stringify(data, null, 2)};

/**
 * Export a count of items by status for debugging
 */
export function getLocalDataStats() {
  const stats = {
    total: localBucketListData.length,
    byStatus: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    priority: 0,
  };

  localBucketListData.forEach(item => {
    // Count by status
    stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1;

    // Count by category
    item.categories.forEach(cat => {
      stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
    });

    // Count priority
    if (item.is_priority) stats.priority++;
  });

  return stats;
}
`;

  // Write the file
  const outputPath = resolve(__dirname, '../lib/local-data.ts');
  writeFileSync(outputPath, fileContent, 'utf-8');

  console.log(`Successfully exported ${data.length} items to:`);
  console.log(`  ${outputPath}\n`);

  // Print stats
  const statusCounts: Record<string, number> = {};
  data.forEach(item => {
    statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
  });

  console.log('Items by status:');
  Object.entries(statusCounts).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });

  const priorityCount = data.filter(item => item.is_priority).length;
  console.log(`\nPriority items: ${priorityCount}`);
}

exportData().catch(console.error);
