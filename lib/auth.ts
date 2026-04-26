import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const AUTH_COOKIE = 'gym_auth';

export async function login() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.has(AUTH_COOKIE);
}

export async function requireAuth() {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    redirect('/login');
  }
}
