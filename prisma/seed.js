const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.FundMeetingDetail.deleteMany();
  await prisma.fund.deleteMany();
  await prisma.manager.deleteMany();

  // Create managers
  const bain = await prisma.manager.create({ data: { managerName: 'Bain Capital' } });
  const hg = await prisma.manager.create({ data: { managerName: 'Hg Capital' } });
  const radical = await prisma.manager.create({ data: { managerName: 'Radical Ventures' } });

  // Create funds (with returned IDs)
  const bainFund = await prisma.fund.create({
    data: {
      name: 'Bain Distressed Opportunities 2020',
      strategy: 'Buyout, Special Situations',
      assetClass: 'Private Equity, Credit',
      targetNetReturn: 18,
      geographicFocus: 'North America',
      size: BigInt(4_000_000_000),
      currency: 'USD',
      region: 'North America',
      tier: 'Tier 1',
      tierJustification: 'Top-quartile track record and deep GAF relationship.',
      managerId: bain.id,
    }
  });

  const hgFund = await prisma.fund.create({
    data: {
      name: 'Hg Saturn 3',
      strategy: 'Buyout',
      assetClass: 'Private Equity',
      targetNetReturn: 15,
      geographicFocus: 'Europe',
      size: BigInt(10_000_000_000),
      currency: 'GBP',
      region: 'Europe',
      tier: 'Tier 2',
      tierJustification: 'Strong market position but limited GAF exposure.',
      managerId: hg.id,
    }
  });

  const radicalFund = await prisma.fund.create({
    data: {
      name: 'Radical AI Fund II',
      strategy: 'AI-focused',
      assetClass: 'Venture Capital',
      targetNetReturn: 25,
      geographicFocus: 'Global',
      size: BigInt(1_000_000_000),
      currency: 'USD',
      region: 'Global',
      tier: 'Tier 3',
      tierJustification: 'Early stage focus and unproven returns.',
      managerId: radical.id,
    }
  });

  // Create meetings for each fund
  await prisma.FundMeetingDetail.createMany({
    data: [
      {
        fundId: bainFund.id,
        meetingDate: new Date('2024-04-01'),
        fundSize: BigInt(4_000_000_000),
        gafAttendees: 'DW, PL',
        externalAttendees: 'HD, SB',
        notes: 'Discussed Fund III pipeline and fees.'
      },
      {
        fundId: bainFund.id,
        meetingDate: new Date('2025-01-10'),
        fundSize: BigInt(4_500_000_000),
        gafAttendees: 'DW',
        externalAttendees: 'SB',
        notes: 'Updated performance numbers and sidecar co-investment.'
      },
      {
        fundId: hgFund.id,
        meetingDate: new Date('2024-06-15'),
        fundSize: BigInt(10_000_000_000),
        gafAttendees: 'TN',
        externalAttendees: 'SR',
        notes: 'ESG framework presentation, discussion on platform roll-up strategy.'
      },
      {
        fundId: hgFund.id,
        meetingDate: new Date('2025-02-20'),
        fundSize: BigInt(10_200_000_000),
        gafAttendees: 'TN, PL',
        externalAttendees: 'SR, JD',
        notes: 'Fund IV launch and potential soft circle.'
      },
      {
        fundId: radicalFund.id,
        meetingDate: new Date('2024-11-30'),
        fundSize: BigInt(1_000_000_000),
        gafAttendees: 'DW, TN',
        externalAttendees: 'BR',
        notes: 'Deep dive into portfolio LLM strategies.'
      },
      {
        fundId: radicalFund.id,
        meetingDate: new Date('2025-03-15'),
        fundSize: BigInt(1_250_000_000),
        gafAttendees: 'DW',
        externalAttendees: 'SB',
        notes: 'GP expansion, raising target AUM to $1.5B.'
      },
    ]
  });

  console.log('✅ Fund, Manager, and Meeting data seeded');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
