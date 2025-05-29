import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Managers
  const managerNames = [
    "Arctos Sports",
    "Bain",
    "Bridgepoint",
    "Dawson",
    "FitzWalter",
    "Genstar",
    "GIP",
    "Goldman Sachs",
    "HG",
    "HIG",
    "HPS",
    "Integrum",
    "JF Lehman",
    "NEA"
  ];

  // Insert managers if not already present
  const managers = await Promise.all(
    managerNames.map(async (name) => {
      const existing = await prisma.manager.findFirst({ where: { managerName: name } });
      if (existing) return existing;
      return prisma.manager.create({ data: { managerName: name } });
    })
  );

  // Funds data (just made up examples)
  const fundsData = [
    { name: "Alpha Growth", strategy: "Growth", region: "North America", geographicFocus: "Global" },
    { name: "Beta Value", strategy: "Value", region: "Europe", geographicFocus: "Europe" },
    { name: "Gamma Opportunities", strategy: "Opportunistic", region: "Asia", geographicFocus: "Asia" },
    { name: "Delta Credit", strategy: "Credit", region: "Global", geographicFocus: "Global" },
    { name: "Epsilon Infrastructure", strategy: "Infrastructure", region: "Americas", geographicFocus: "Americas" },
    { name: "Zeta Real Estate", strategy: "Real Estate", region: "EMEA", geographicFocus: "Europe" },
    { name: "Eta Special Situations", strategy: "Special Situations", region: "Europe", geographicFocus: "Europe" },
    { name: "Theta Private Debt", strategy: "Private Debt", region: "North America", geographicFocus: "North America" },
    { name: "Iota Diversified", strategy: "Diversified", region: "Asia", geographicFocus: "Asia" },
    { name: "Kappa Growth Fund", strategy: "Growth", region: "Americas", geographicFocus: "Americas" },
    { name: "Lambda Buyout", strategy: "Buyout", region: "Europe", geographicFocus: "Global" },
    { name: "Mu Venture", strategy: "Venture Capital", region: "Global", geographicFocus: "Global" },
    { name: "Nu Co-Investment", strategy: "Co-Investment", region: "EMEA", geographicFocus: "Europe" },
    { name: "Xi Direct Lending", strategy: "Direct Lending", region: "Americas", geographicFocus: "North America" },
    { name: "Omicron Emerging Markets", strategy: "Emerging Markets", region: "Asia", geographicFocus: "Asia" },
    { name: "Pi Distressed", strategy: "Distressed", region: "Europe", geographicFocus: "EMEA" },
    { name: "Rho Strategic", strategy: "Strategic", region: "Global", geographicFocus: "Global" },
    { name: "Sigma Absolute Return", strategy: "Absolute Return", region: "Americas", geographicFocus: "Americas" },
    { name: "Tau Tactical Opportunities", strategy: "Tactical Opportunities", region: "Asia", geographicFocus: "Asia" },
    { name: "Upsilon Balanced", strategy: "Balanced", region: "North America", geographicFocus: "North America" }
  ];

  // Insert 20 funds, randomly assign a manager
  for (const fund of fundsData) {
    const manager = managers[Math.floor(Math.random() * managers.length)];
    const existingFund = await prisma.fund.findFirst({ where: { name: fund.name } });
    if (!existingFund) {
      await prisma.fund.create({
        data: {
          name: fund.name,
          strategy: fund.strategy,
          assetClass: "Equity",
          targetNetReturn: Math.floor(Math.random() * 15) + 5,
          geographicFocus: fund.geographicFocus,
          size: BigInt(50000000 + Math.floor(Math.random() * 100000000)),
          currency: "USD",
          region: fund.region,
          managerId: manager.id
        }
      });
    }
  }
}

main()
  .then(() => {
    console.log("Seeding complete!");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });