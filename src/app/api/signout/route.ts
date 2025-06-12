import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: 'Signed out successfully.' });

  res.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0) // Immediately expire the cookie
  });

  return res;
}
