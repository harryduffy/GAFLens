// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data (optional for dev)
  await prisma.managerMeetingDetail.deleteMany();
  await prisma.manager.deleteMany();

  // Seed managers
  const managers = await prisma.manager.createMany({
    data: [
      {
        managerName: 'Bain Capital',
        region: 'North America',
        currency: 'USD',
        AUM: BigInt(100_000_000_000),
      },
      {
        managerName: 'Hg Capital',
        region: 'Europe',
        currency: 'GBP',
        AUM: BigInt(50_000_000_000),
      },
      {
        managerName: 'Radical Ventures',
        region: 'Global',
        currency: 'USD',
        AUM: BigInt(5_000_000_000),
      }
    ]
  });

  // Seed manager meeting details
  await prisma.managerMeetingDetail.createMany({
    data: [
      {
        managerName: 'Bain Capital',
        managerCountry: 'USA',
        meetingDate: new Date('2024-03-01'),
        managerAUM: BigInt(100_000_000_000),
        fundName: 'Bain Distressed Opportunities 2020',
        fundSize: BigInt(4_000_000_000),
        assetClasses: 'Private Equity, Credit',
        investmentStrategies: 'Buyout, Special Situations',
        fundGeographicFocus: 'North America',
        fundTargetNetReturn: 18,
        gafAttendees: 'DW, PL',
        externalAttendees: 'HD, SB',
        notes: 'Strong performance history, aggressive fee terms.'
      },
      {
        managerName: 'Hg Capital',
        managerCountry: 'UK',
        meetingDate: new Date('2025-01-15'),
        managerAUM: BigInt(50_000_000_000),
        fundName: 'Hg Saturn 3',
        fundSize: BigInt(10_000_000_000),
        assetClasses: 'Private Equity',
        investmentStrategies: 'Buyout',
        fundGeographicFocus: 'Europe',
        fundTargetNetReturn: 15,
        gafAttendees: 'TN',
        externalAttendees: 'SR',
        notes: 'Deep dive into B2B SaaS verticals.'
      },
      {
        managerName: 'Radical Ventures',
        managerCountry: 'Canada',
        meetingDate: new Date('2025-05-12'),
        managerAUM: BigInt(5_000_000_000),
        fundName: 'Radical AI Fund II',
        fundSize: BigInt(1_000_000_000),
        assetClasses: 'Venture Capital',
        investmentStrategies: 'AI-focused',
        fundGeographicFocus: 'Global',
        fundTargetNetReturn: 25,
        gafAttendees: 'DW, PL, TN',
        externalAttendees: 'HD, BR',
        notes: 'Focused on large language model applications.'
      }
    ]
  });

  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
