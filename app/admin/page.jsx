import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AdminPanel from '@/components/AdminPanel';

export default async function AdminPage() {
  // 1. Check for the "admin_token" cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');

  // 2. If no token, kick them to the login page
  if (!token || token.value !== 'authenticated') {
    redirect('/admin/login');
  }

  // 3. If authenticated, show the Upload Panel
  return <AdminPanel />;
}