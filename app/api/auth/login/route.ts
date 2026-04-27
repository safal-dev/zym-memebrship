import { NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Super Admin Credentials
  if (username === 'superadmin' && password === 'super123') {
    await login('superadmin');
    return NextResponse.json({ success: true, redirect: '/super-admin' });
  }

  // Regular Gym Admin Credentials (Hardcoded for now, or fetch from DB later)
  if (username === 'admin' && password === 'admin123') {
    await login('admin');
    return NextResponse.json({ success: true, redirect: '/dashboard' });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
