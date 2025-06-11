const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data (optional)
  await prisma.fund.deleteMany();
  await prisma.manager.deleteMany();

  // Create managers first
  const managers = await Promise.all([
    prisma.manager.create({
      data: {
        managerName: 'Bain Capital',
      },
    }),
    prisma.manager.create({
      data: {
        managerName: 'Hg',
      },
    }),
    prisma.manager.create({
      data: {
        managerName: 'Goldman Sachs',
      },
    }),
    prisma.manager.create({
      data: {
        managerName: 'Dawson Partners',
      },
    }),
    prisma.manager.create({
      data: {
        managerName: 'Arlington',
      },
    }),
  ]);

  // Helper function to randomly assign status
  const getRandomStatus = () => Math.random() > 0.5 ? 'accepted' : 'declined';

  // Asset class options
  const assetClasses = ['Private Equity', 'Private Credit', 'Infrastructure', 'Venture Capital'];
  const getRandomAssetClass = () => assetClasses[Math.floor(Math.random() * assetClasses.length)];

  // Tier justification options
  const tierJustifications = [
    'Fund demonstrates strong historical performance with consistent returns above benchmark over multiple market cycles.',
    'Manager has extensive experience in the asset class with a proven track record of risk-adjusted returns.',
    'Investment strategy is well-defined with clear competitive advantages and differentiated approach to value creation.',
    'Strong operational infrastructure and institutional-quality investment processes support scalable growth.',
    'Fund size provides optimal balance between capacity constraints and ability to execute investment strategy effectively.',
    'Geographic focus aligns with portfolio diversification objectives and offers attractive risk-return profile.',
    'Management team has deep sector expertise and maintains strong relationships with key market participants.',
    'Investment approach incorporates robust ESG considerations and sustainable investment practices.',
  ];

  const getRandomJustification = () => tierJustifications[Math.floor(Math.random() * tierJustifications.length)];

  // Create funds
  const funds = await Promise.all([
    prisma.fund.create({
      data: {
        name: 'Global Equity Growth Fund',
        strategy: 'Growth',
        assetClass: 'Equity',
        targetNetReturn: 12.5,
        geographicFocus: 'Global',
        size: '500000000', // $500M
        currency: 'USD',
        region: 'Global',
        managerId: managers[0].id,
        tierJustification: getRandomJustification(),
        status: getRandomStatus(),
      },
    }),
    prisma.fund.create({
      data: {
        name: 'Asia Pacific Value Fund',
        strategy: 'Value',
        assetClass: 'Equity',
        targetNetReturn: 10.2,
        geographicFocus: 'Asia Pacific',
        size: '250000000', // $250M
        currency: 'USD',
        region: 'Asia Pacific',
        managerId: managers[1].id,
        tierJustification: getRandomJustification(),
        status: getRandomStatus(),
      },
    }),
    prisma.fund.create({
      data: {
        name: 'European High Yield Bond Fund',
        strategy: 'Fixed Income',
        assetClass: 'Fixed Income',
        targetNetReturn: 6.8,
        geographicFocus: 'Europe',
        size: '750000000', // $750M
        currency: 'EUR',
        region: 'Europe',
        managerId: managers[2].id,
        tierJustification: getRandomJustification(),
        status: getRandomStatus(),
      },
    }),
    prisma.fund.create({
      data: {
        name: 'US Technology Innovation Fund',
        strategy: 'Growth',
        assetClass: 'Equity',
        targetNetReturn: 15.3,
        geographicFocus: 'North America',
        size: '1000000000', // $1B
        currency: 'USD',
        region: 'North America',
        managerId: managers[3].id,
        tierJustification: getRandomJustification(),
        status: getRandomStatus(),
      },
    }),
    prisma.fund.create({
      data: {
        name: 'Emerging Markets Diversified Fund',
        strategy: 'Diversified',
        assetClass: 'Mixed',
        targetNetReturn: 11.7,
        geographicFocus: 'Emerging Markets',
        size: '300000000', // $300M
        currency: 'USD',
        region: 'Emerging Markets',
        managerId: managers[4].id,
        tierJustification: getRandomJustification(),
        status: getRandomStatus(),
      },
    }),
    prisma.fund.create({
      data: {
        name: 'Australian Property Fund',
        strategy: 'Real Estate',
        assetClass: 'Real Estate',
        targetNetReturn: 8.5,
        geographicFocus: 'Australia',
        size: '450000000', // $450M
        currency: 'AUD',
        region: 'Australia',
        managerId: managers[0].id,
        tierJustification: getRandomJustification(),
        status: getRandomStatus(),
      },
    }),
    prisma.fund.create({
      data: {
        name: 'Global Infrastructure Fund',
        strategy: 'Infrastructure',
        assetClass: 'Alternative',
        targetNetReturn: 9.2,
        geographicFocus: 'Global',
        size: '800000000', // $800M
        currency: 'USD',
        region: 'Global',
        managerId: managers[1].id,
        tierJustification: getRandomJustification(),
        status: getRandomStatus(),
      },
    }),
    prisma.fund.create({
      data: {
        name: 'Latin America Equity Fund',
        strategy: 'Growth',
        assetClass: 'Equity',
        targetNetReturn: 13.1,
        geographicFocus: 'Latin America',
        size: '180000000', // $180M
        currency: 'USD',
        region: 'Latin America',
        managerId: managers[2].id,
        tierJustification: getRandomJustification(),
        status: getRandomStatus(),
      },
    }),
  ]);

  console.log(`✅ Database seeded successfully!`);
  console.log(`📊 Created ${managers.length} managers`);
  console.log(`💼 Created ${funds.length} funds`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });