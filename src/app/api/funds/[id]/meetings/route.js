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
    id: m.id,
    meetingDate: m.meetingDate,
    fundSize: m.fundSize.toString(), // convert BigInt for JSON compatibility
    gafAttendees: m.gafAttendees,
    externalAttendees: m.externalAttendees,
    notes: m.notes,
    fundId: m.fundId
  }));

  return new Response(JSON.stringify({
    id: fund.id, // assuming this is a regular Int
    fundName: fund.name,
    strategy: fund.strategy,
    assetClass: fund.assetClass,
    targetNetReturn: fund.targetNetReturn,
    geographicFocus: fund.geographicFocus,
    size: fund.size.toString(), // 👈 BigInt fix
    currency: fund.currency,
    region: fund.region,
    managerName: fund.managerName,
    fundTier: fund.tier,
    meetings: fund.meetings.map((m) => ({
      id: m.id,
      meetingDate: m.meetingDate,
      fundSize: m.fundSize.toString(), // 👈 also a BigInt
      gafAttendees: m.gafAttendees,
      externalAttendees: m.externalAttendees,
      notes: m.notes,
      fundId: m.fundId
    }))
  }), {
    headers: { 'Content-Type': 'application/json' }
  });

}
