const Database = require('better-sqlite3');
const { PrismaClient } = require('@prisma/client');

const sqliteDb = new Database('prisma/dev.db', { readonly: true });
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting data transfer from SQLite to MySQL...');

  // Step 1: Load Managers from SQLite
  const sqliteManagers = sqliteDb.prepare('SELECT * FROM Manager').all();

  for (const manager of sqliteManagers) {
    // Create Manager in MySQL
    const createdManager = await prisma.manager.create({
      data: {
        id: manager.id, // preserve original ID
        managerName: manager.managerName,
      }
    });

    // Step 2: Load Funds for this manager
    const sqliteFunds = sqliteDb.prepare('SELECT * FROM Fund WHERE managerId = ?').all(manager.id);

    for (const fund of sqliteFunds) {
      // Create Fund in MySQL
      const createdFund = await prisma.fund.create({
        data: {
          id: fund.id, // preserve original ID
          name: fund.name,
          strategy: fund.strategy,
          assetClass: fund.assetClass,
          targetNetReturn: fund.targetNetReturn,
          geographicFocus: fund.geographicFocus,
          size: BigInt(fund.size), // BigInt conversion
          currency: fund.currency,
          region: fund.region,
          tier: fund.tier,
          tierJustification: fund.tierJustification,
          managerId: createdManager.id,
        }
      });

      // Step 3: Load FundMeetingDetails for this fund
      const sqliteMeetings = sqliteDb.prepare('SELECT * FROM FundMeetingDetail WHERE fundId = ?').all(fund.id);

      for (const meeting of sqliteMeetings) {
        // Create Meeting in MySQL
        await prisma.fundMeetingDetail.create({
          data: {
            id: meeting.id, // preserve original ID
            meetingDate: new Date(meeting.meetingDate),
            fundSize: BigInt(meeting.fundSize),
            gafAttendees: meeting.gafAttendees,
            externalAttendees: meeting.externalAttendees,
            notes: meeting.notes,
            fundId: createdFund.id,
          }
        });
      }
    }
  }

  console.log('✅ All data transferred successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during data transfer:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    sqliteDb.close();
  });
