import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LoginButton } from './login-button';

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-12">
      <div className="w-full max-w-md animate-scale-in">
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-gray-900/5">
          {/* Decorative gradient overlay */}
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-gradient-to-tr from-pink-400 to-indigo-400 opacity-20 blur-3xl"></div>

          <div className="relative space-y-8">
            <div className="text-center">
              <div className="mb-3 inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Horizon
              </h1>
              <p className="mt-3 text-base text-gray-600 font-medium">
                Your shared life architecture
              </p>
            </div>

            <div className="mt-8">
              <LoginButton />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-center text-sm text-gray-500">
                Securely sign in to access your shared bucket list
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Built with love for couples who dream together
        </p>
      </div>
    </div>
  );
}
