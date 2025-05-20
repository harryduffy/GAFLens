import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const funds = await prisma.fund.findMany({
    include: {
      manager: true
    }
  });

  // Convert BigInts and nested objects to JSON-safe values
  const safeFunds = funds.map(fund => ({
    ...fund,
    size: fund.size.toString(),
    manager: {
      ...fund.manager
    }
  }));

  return new Response(JSON.stringify(safeFunds), {
    headers: { 'Content-Type': 'application/json' }
  });
}
