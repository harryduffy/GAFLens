import { generateSummaryPDF } from '../../../utils/writeSummaryToPDF.js';

export async function POST(req) {
  const { meeting } = await req.json();
  const summaryText = '• Summary 1\n• Summary 2\n• Summary 3';

  const pdfBytes = await generateSummaryPDF(summaryText, meeting);
  const fileName = `summary-${meeting.fundName.replace(/\s+/g, '_')}.pdf`;

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