// File: src/app/api/managers/names/route.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const managers = await prisma.manager.findMany({
      select: { name: true },
      orderBy: { name: 'asc' },
    });

    return new Response(JSON.stringify(managers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[API ERROR]', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch names' }), {
      status: 500
    });
  }
}