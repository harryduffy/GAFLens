import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  const id = parseInt(params.id);
  const data = await req.json();

  try {
    const updatedFund = await prisma.fund.update({
      where: { id },
      data: {
        name: data.name,
        tier: data.fundTier,
        size: BigInt(data.size),
        assetClass: data.assetClass,
        strategy: data.strategy,
        targetNetReturn: data.targetNetReturn,
        geographicFocus: data.geographicFocus,
        currency: data.currency,
        region: data.region,
        managerName: data.managerName,
        tierJustification: data.tierJustification,
        status: data.status
      }
    });

    // Safely serialize BigInt
    const safeFund = {
      ...updatedFund,
      size: updatedFund.size.toString()
    };

    return new Response(JSON.stringify(safeFund), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error("❌ Failed to update fund:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}