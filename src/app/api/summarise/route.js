import { PrismaClient } from '@prisma/client';
import { generateSummaryPDF } from '../../../utils/writeSummaryToPDF.js';

const prisma = new PrismaClient();

export async function POST(req) {
  const { meeting, fund } = await req.json();

  // Fetch the full fund object including manager
  const fullFund = await prisma.fund.findUnique({
    where: { id: fund.id },
    include: { manager: true }
  });

  const summaryText = '• Summary 1\n• Summary 2\n• Summary 3';

  const pdfBytes = await generateSummaryPDF(summaryText, meeting, {
    ...fullFund,
    managerName: fullFund.manager?.managerName ?? ''
  });

  const fileName = `summary-${(fullFund.name || 'meeting').replace(/\s+/g, '_')}.pdf`;

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(pdfBytes));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    },
  });
}