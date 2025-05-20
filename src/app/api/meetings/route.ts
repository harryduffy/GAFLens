import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('Incoming data:', body);

    const newMeeting = await prisma.managerMeetingDetail.create({
      data: {
        managerName: body.managerName,
        managerCountry: body.managerCountry,
        meetingDate: new Date(body.meetingDate),
        managerAUM: BigInt(body.managerAUM),
        fundName: body.fundName,
        fundSize: BigInt(body.fundSize),
        assetClasses: body.assetClasses,
        investmentStrategies: body.investmentStrategies,
        fundGeographicFocus: body.fundGeographicFocus,
        fundTargetNetReturn: parseInt(body.fundTargetNetReturn),
        gafAttendees: body.gafAttendees,
        externalAttendees: body.externalAttendees,
        notes: body.notes,
      },
    });

    return new Response(
      JSON.stringify({
        ...newMeeting,
        managerAUM: newMeeting.managerAUM.toString(),
        fundSize: newMeeting.fundSize.toString(),
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error('Failed to create meeting:', err);
    return new Response(JSON.stringify({ error: 'Failed to create meeting' }), { status: 500 });
  }
}
