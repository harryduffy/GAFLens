import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const meetings = await prisma.managerMeeting.findMany({
      orderBy: { lastMeetingDate: 'asc' },
    });

    const safeMeetings = meetings.map((m) => ({
      ...m,
      AUM: m.AUM.toString(),
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