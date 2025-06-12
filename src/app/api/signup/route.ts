import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `FundLens (${email})`
    });

    // Create user in DB
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        totpSecret: secret.base32,
        mfaEnabled: true
      }
    });

    // Generate QR code as base64
    const otpauthUrl = secret.otpauth_url;
    const qrCodeDataURL = await qrcode.toDataURL(otpauthUrl || '');

    return NextResponse.json({
      message: 'User created successfully.',
      qrCode: qrCodeDataURL,
      userId: newUser.id
    });
  } catch (err: any) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
