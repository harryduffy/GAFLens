import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(_, { params }) {
  const fundId = parseInt(params.id);

  const fund = await prisma.fund.findUnique({
    where: { id: fundId },
    include: { meetings: true }
  });

  if (!fund) {
    return new Response(JSON.stringify({ error: 'Fund not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const meetings = fund.meetings.map(m => ({
    ...m,
    fundSize: m.fundSize.toString()
  }));

  return new Response(JSON.stringify({ fundName: fund.name, meetings }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
