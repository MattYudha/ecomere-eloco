import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';

export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions as any);
  return (session as any)?.user?.role === 'admin';
}

export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error('Admin access required');
  }
}
