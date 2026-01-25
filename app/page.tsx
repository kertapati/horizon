import { createClient } from '@/lib/supabase/server';
import { BucketListOptimized } from '@/components/bucket-list-optimized';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log('Home page - User:', user?.email, 'Error:', userError);

  if (!user) {
    return null; // Middleware will redirect to login
  }

  return (
    <div className="h-screen">
      <BucketListOptimized />
    </div>
  );
}
