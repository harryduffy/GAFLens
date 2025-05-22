import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.fundName || !body.meetingDate) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const fund = await prisma.fund.findFirst({
      where: { name: body.fundName }
    });

    if (!fund) {
      return new Response(JSON.stringify({ error: 'Fund not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create meeting record
    const createdMeeting = await prisma.fundMeetingDetail.create({
      data: {
        meetingDate: new Date(body.meetingDate),
        fundSize: BigInt(body.fundSize || 0),
        gafAttendees: body.gafAttendees || '',
        externalAttendees: body.externalAttendees || '',
        notes: body.notes || '',
        fundId: fund.id
      }
    });

    // Update fund fields (only the editable subset from form)
    await prisma.fund.update({
      where: { id: fund.id },
      data: {
        size: body.fundSize ? BigInt(body.fundSize) : fund.size,
        targetNetReturn: body.fundTargetNetReturn
          ? parseInt(body.fundTargetNetReturn)
          : fund.targetNetReturn,
        geographicFocus: body.fundGeographicFocus || fund.geographicFocus
        // Add other editable fund fields here as needed
      }
    });

    const safeResponse = {
      ...createdMeeting,
      fundSize: createdMeeting.fundSize.toString()
    };

    return new Response(JSON.stringify({ success: true, created: safeResponse }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('❌ POST /api/meetings error:', err);
    return new Response(JSON.stringify({ error: 'Failed to save meeting' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
