import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Helper function to safely convert BigInt values
function convertBigIntToString(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

export async function GET(req) {
  try {
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
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { strategy: { contains: searchQuery, mode: 'insensitive' } },
            { geographicFocus: { contains: searchQuery, mode: 'insensitive' } },
            { region: { contains: searchQuery, mode: 'insensitive' } }
          ]
        },
        include: {
          manager: true
        }
      });
    }

    // Convert all BigInt values to strings
    const safeFunds = convertBigIntToString(funds);

    return NextResponse.json(safeFunds);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch funds' },
      { status: 500 }
    );
  }
}