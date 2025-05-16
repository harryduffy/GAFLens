import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const decodedName = decodeURIComponent(params.name);

    const meetings = await prisma.managerMeetingDetail.findMany({
      where: { managerName: decodedName },
      orderBy: { meetingDate: 'desc' },
    });

    const safeMeetings = meetings.map((m) => ({
      ...m,
      managerAUM: m.managerAUM.toString(),
      fundSize: m.fundSize.toString(),
    }));

    return new Response(JSON.stringify(safeMeetings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[API ERROR]', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
    });
  }
}

