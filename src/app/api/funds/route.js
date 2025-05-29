import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get("q") || "";

  let funds;

  if (searchQuery === "") {
    // No search query: get all funds
    funds = await prisma.fund.findMany({
      include: {
        manager: true
      }
    });
  } else {
    // Search in name, strategy, geographicFocus, region
    funds = await prisma.fund.findMany({
      where: {
        OR: [
          { name: { contains: searchQuery } },
          { strategy: { contains: searchQuery } },
          { geographicFocus: { contains: searchQuery } },
          { region: { contains: searchQuery } }
        ]
      },
      include: {
        manager: true
      }
    });
  }

  // Convert BigInts to JSON-safe
  const safeFunds = funds.map(fund => ({
    ...fund,
    size: fund.size.toString(),
    manager: { ...fund.manager }
  }));

  return new Response(JSON.stringify(safeFunds), {
    headers: { 'Content-Type': 'application/json' }
  });
}