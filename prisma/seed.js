const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Helper function to generate random date between two dates
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to get random item from array
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to generate random float between min and max
function randomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.fundMeetingDetail.deleteMany();
  await prisma.fund.deleteMany();
  await prisma.manager.deleteMany();
  await prisma.user.deleteMany();

  // Sample data arrays
  const strategies = ['Growth Equity', 'Buyout', 'Venture Capital', 'Distressed', 'Real Estate', 'Infrastructure'];
  const assetClasses = ['Private Equity', 'Real Estate', 'Infrastructure', 'Venture Capital', 'Hedge Fund'];
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Global'];
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
  const geographicFocus = ['US', 'Europe', 'Asia', 'Global', 'Emerging Markets', 'APAC'];
  const tiers = ['Tier 1', 'Tier 2', 'Tier 3'];
  const statuses = ['accepted', 'pending', 'declined'];

  // Create Managers
  const managers = [];
  const managerNames = [
    'Apollo Global Management',
    'Blackstone Group',
    'KKR & Co',
    'Carlyle Group',
    'TPG Inc',
    'Bain Capital',
    'Silver Lake Partners',
    'Warburg Pincus',
    'General Atlantic',
    'Vista Equity Partners'
  ];

  for (const managerName of managerNames) {
    const manager = await prisma.manager.create({
      data: {
        managerName: managerName,
      },
    });
    managers.push(manager);
  }

  // Create Funds
  const funds = [];
  for (let i = 0; i < 25; i++) {
    const firstClose = randomDate(new Date(2020, 0, 1), new Date(2023, 11, 31));
    const finalClose = randomDate(firstClose, new Date(firstClose.getTime() + 365 * 24 * 60 * 60 * 1000)); // Within 1 year of first close

    const fund = await prisma.fund.create({
      data: {
        name: `${randomItem(managers).managerName} Fund ${i + 1}`,
        strategy: randomItem(strategies),
        assetClass: randomItem(assetClasses),
        targetNetReturn: randomFloat(8.0, 25.0), // 8% to 25% return
        geographicFocus: randomItem(geographicFocus),
        size: BigInt(Math.floor(Math.random() * 5000000000) + 100000000), // $100M to $5B
        currency: randomItem(currencies),
        region: randomItem(regions),
        firstClose: firstClose,
        finalClose: finalClose,
        investmentPeriod: Math.floor(Math.random() * 5) + 3, // 3-7 years
        fundTerm: Math.floor(Math.random() * 5) + 8, // 8-12 years
        targetNetMOIC: randomFloat(1.5, 4.0), // 1.5x to 4.0x multiple
        tier: Math.random() > 0.3 ? randomItem(tiers) : null, // 70% chance of having a tier
        tierJustification: Math.random() > 0.5 ? 'Strong track record and experienced team' : null,
        status: randomItem(statuses),
        managerId: randomItem(managers).id,
      },
    });
    funds.push(fund);
  }

  // Create Fund Meeting Details
  for (const fund of funds) {
    const numMeetings = Math.floor(Math.random() * 4) + 1; // 1-4 meetings per fund
    
    for (let j = 0; j < numMeetings; j++) {
      await prisma.fundMeetingDetail.create({
        data: {
          meetingDate: randomDate(fund.firstClose, new Date()),
          fundSize: BigInt(Math.floor(Math.random() * 2000000000) + 500000000), // $500M to $2.5B
          gafAttendees: `John Doe, Jane Smith${Math.random() > 0.5 ? ', Mike Johnson' : ''}`,
          externalAttendees: `External Partner ${j + 1}, Investment Director`,
          notes: `Meeting ${j + 1} notes: Discussed fund strategy, market conditions, and investment pipeline. ${Math.random() > 0.5 ? 'Follow-up required.' : 'Positive feedback received.'}`,
          fundId: fund.id,
        },
      });
    }
  }

  // Create Users
  const users = [
    {
      email: 'admin@example.com',
      passwordHash: '$2b$10$example.hash.here', // In real app, properly hash passwords
      totpSecret: 'JBSWY3DPEHPK3PXP',
      mfaEnabled: true,
    },
    {
      email: 'user@example.com',
      passwordHash: '$2b$10$example.hash.here',
      totpSecret: 'JBSWY3DPEHPK3PXT',
      mfaEnabled: false,
    },
  ];

  for (const userData of users) {
    await prisma.user.create({
      data: userData,
    });
  }

  console.log('✅ Seed completed!');
  console.log(`📊 Created:`);
  console.log(`   - ${managers.length} managers`);
  console.log(`   - ${funds.length} funds`);
  console.log(`   - ${users.length} users`);
  console.log(`   - Multiple fund meeting details`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });