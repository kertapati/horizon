import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Admin API route to seed the bucket list
 *
 * Usage: POST /api/seed
 *
 * Note: For large datasets, it's recommended to run the CLI script instead:
 * npx tsx scripts/seed-bucket-list.ts
 */
export async function POST() {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'Please run the seed script from the command line',
      command: 'npx tsx scripts/seed-bucket-list.ts',
      reason: 'The dataset is too large to run via API request (timeout limits)',
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Bucket List Seed Endpoint',
    usage: 'POST to this endpoint to seed the database',
    cliCommand: 'npx tsx scripts/seed-bucket-list.ts',
    note: 'CLI method is recommended for large datasets',
  });
}
