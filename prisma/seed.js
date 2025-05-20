const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.fund.deleteMany();
  await prisma.manager.deleteMany();

  // Create managers
  const bain = await prisma.manager.create({ data: { managerName: 'Bain Capital' } });
  const hg = await prisma.manager.create({ data: { managerName: 'Hg Capital' } });
  const radical = await prisma.manager.create({ data: { managerName: 'Radical Ventures' } });

  // Create funds
  await prisma.fund.createMany({
    data: [
      {
        name: 'Bain Distressed Opportunities 2020',
        strategy: 'Buyout, Special Situations',
        assetClass: 'Private Equity, Credit',
        targetNetReturn: 18,
        geographicFocus: 'North America',
        size: BigInt(4_000_000_000),
        currency: 'USD',
        region: 'North America',
        managerId: bain.id
      },
      {
        name: 'Hg Saturn 3',
        strategy: 'Buyout',
        assetClass: 'Private Equity',
        targetNetReturn: 15,
        geographicFocus: 'Europe',
        size: BigInt(10_000_000_000),
        currency: 'GBP',
        region: 'Europe',
        managerId: hg.id
      },
      {
        name: 'Radical AI Fund II',
        strategy: 'AI-focused',
        assetClass: 'Venture Capital',
        targetNetReturn: 25,
        geographicFocus: 'Global',
        size: BigInt(1_000_000_000),
        currency: 'USD',
        region: 'Global',
        managerId: radical.id
      }
    ]
  });

  console.log('✅ Fund and Manager seed complete');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });