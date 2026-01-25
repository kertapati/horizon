/**
 * Add Country Field to Database
 *
 * Adds a country field to bucket_list_items table for better geographic grouping
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addCountryField() {
  console.log('📝 Adding country field to bucket_list_items...\n');

  try {
    // Note: Supabase doesn't allow ALTER TABLE through the API
    // This needs to be run directly in the Supabase SQL editor

    const sqlCommand = `
-- Add country field to bucket_list_items table
ALTER TABLE bucket_list_items ADD COLUMN IF NOT EXISTS country TEXT;

-- Add index for faster country-based queries
CREATE INDEX IF NOT EXISTS idx_bucket_list_items_country ON bucket_list_items(country);

-- Add index for location_type + country queries
CREATE INDEX IF NOT EXISTS idx_bucket_list_items_location_country ON bucket_list_items(location_type, country);
`;

    console.log('⚠️  Please run this SQL command in your Supabase SQL Editor:\n');
    console.log(sqlCommand);
    console.log('\n✅ After running the SQL, run the migration script to populate country data.');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addCountryField();
