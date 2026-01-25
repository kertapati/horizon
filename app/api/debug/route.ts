import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // Try to fetch items
  const { data: items, error: itemsError } = await supabase
    .from('bucket_list_items')
    .select('*');

  return NextResponse.json({
    auth: {
      user: user ? {
        id: user.id,
        email: user.email,
      } : null,
      error: authError?.message,
    },
    items: {
      count: items?.length || 0,
      error: itemsError?.message,
      sample: items?.slice(0, 3).map(i => ({ title: i.title, added_by: i.added_by })),
    },
  });
}
