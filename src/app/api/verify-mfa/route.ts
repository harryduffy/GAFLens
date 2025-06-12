import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'; // Replace in prod

export async function POST(req: Request) {
  try {
    const { userId, token } = await req.json();

    if (!userId || !token) {
      return NextResponse.json({ error: 'Missing userId or token.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.totpSecret) {
      return NextResponse.json({ error: 'User or MFA not found.' }, { status: 404 });
    }

    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token,
      window: 1 // Allows slight clock drift
    });

    if (!verified) {
      return NextResponse.json({ error: 'Invalid code.' }, { status: 401 });
    }

    // TOTP valid, issue JWT
    const jwtToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    const res = NextResponse.json({ message: 'MFA verified successfully.' });
    res.cookies.set('auth_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return res;
  } catch (err) {
    console.error('MFA verification error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
