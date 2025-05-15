const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.managerMeeting.createMany({
    data: [
      {
        managerName: 'Global Infrastructure Partners',
        lastMeetingDate: new Date('2024-01-01'),
        region: 'Global',
        currency: 'USD',
        AUM: 4000000000,
        gafAttendees: 'DW, PL, TN',
        externalAttendees: 'HD, BR'
      },
      {
        managerName: 'Genstar Capital',
        lastMeetingDate: new Date('2024-04-10'),
        region: 'North America',
        currency: 'USD',
        AUM: 1500000000,
        gafAttendees: 'DW',
        externalAttendees: 'SR, SB, HD'
      }
    ]
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
