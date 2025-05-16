import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const managers = await prisma.manager.findMany();

    // Convert BigInt values to strings for JSON
    const safeManagers = managers.map(m => ({
      ...m,
      AUM: m.AUM.toString(),
    }));

    return new Response(JSON.stringify(safeManagers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[API ERROR]', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500
    });
  }
}
