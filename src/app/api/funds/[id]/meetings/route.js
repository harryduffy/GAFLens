import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(req, context) {
  const fundId = parseInt(context?.params?.id);

  if (isNaN(fundId)) {
    return new Response(JSON.stringify({ error: 'Invalid or missing fund ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

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

  return new Response(
    JSON.stringify({
      id: fund.id,
      fundName: fund.name,
      strategy: fund.strategy,
      assetClass: fund.assetClass,
      targetNetReturn: fund.targetNetReturn,
      geographicFocus: fund.geographicFocus,
      size: fund.size.toString(),
      currency: fund.currency,
      region: fund.region,
      managerName: fund.managerName,
      fundTier: fund.tier,
      meetings: fund.meetings.map((m) => ({
        id: m.id,
        meetingDate: m.meetingDate,
        fundSize: m.fundSize.toString(),
        gafAttendees: m.gafAttendees,
        externalAttendees: m.externalAttendees,
        notes: m.notes,
        fundId: m.fundId
      }))
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
