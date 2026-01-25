import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/header';
import { ItemDetail } from '@/components/item-detail';
import { notFound, redirect } from 'next/navigation';

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: item, error } = await supabase
    .from('bucket_list_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header profile={profile} />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <ItemDetail item={item} />
      </main>
    </div>
  );
}
