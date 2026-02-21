import { clearAuthCookie } from '@/lib/auth';
import { success } from '@/lib/apiResponse';

export async function POST() {
  const res = success({ ok: true }, 'Logged out');
  clearAuthCookie(res);
  return res;
}
