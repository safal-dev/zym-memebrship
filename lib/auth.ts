import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const AUTH_COOKIE = 'gym_auth';
const ROLE_COOKIE = 'gym_role';

export async function login(role: 'admin' | 'superadmin' = 'admin') {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });
  cookieStore.set(ROLE_COOKIE, role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  cookieStore.delete(ROLE_COOKIE);
}

export async function getRole() {
  const cookieStore = await cookies();
  return cookieStore.get(ROLE_COOKIE)?.value || null;
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.has(AUTH_COOKIE);
}

export async function requireAuth() {
  if (!await isAuthenticated()) {
    redirect('/login');
  }
}

export async function requireSuperAdmin() {
  await requireAuth();
  if (await getRole() !== 'superadmin') {
    redirect('/dashboard');
  }
}
