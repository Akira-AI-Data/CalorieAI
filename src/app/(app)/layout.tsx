import { redirect } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { auth } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase';

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const supabase = createServerSupabaseClient();
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('onboarded_at')
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (!profile?.onboarded_at) {
    redirect('/onboarding');
  }

  return <AppLayout>{children}</AppLayout>;
}
