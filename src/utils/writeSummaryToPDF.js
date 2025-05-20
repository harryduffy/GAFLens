import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export async function generateSummaryPDF(summaryText, meeting, fund) {
  const templatePath = path.join(process.cwd(), 'summaries', 'fund_summary-template.pdf');
  const fontPath = path.join(process.cwd(), 'fonts', 'Garamond.ttf'); // Ensure this exists!
  const templateBytes = fs.readFileSync(templatePath);
  const fontBytes = fs.readFileSync(fontPath);

  const pdfDoc = await PDFDocument.load(templateBytes);
  pdfDoc.registerFontkit(fontkit);

  const garamondFont = await pdfDoc.embedFont(fontBytes);
  const form = pdfDoc.getForm();

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB');

  const safe = (val) => (val == null ? '' : String(val));
  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB');
  const formatNumber = (n) => n != null ? parseInt(n).toLocaleString('en-US') : '';

  const fields = {
    fundName: safe(fund.name),
    fundSize: formatNumber(fund.size),
    fundTier: safe(fund.tier),
    meetingDate: formatDate(meeting.meetingDate),
    assetClass: safe(fund.assetClass),
    strategy: safe(fund.strategy),
    targetNetIRR: safe(fund.targetNetReturn) + '%',
    gafAttendees: safe(meeting.gafAttendees),
    externalAttendees: safe(meeting.externalAttendees),
    region: safe(fund.region),
    currency: safe(fund.currency),
    geographicFocus: safe(fund.geographicFocus),
    managerName: safe(fund.managerName),
    notes: safe(meeting.notes),
    dateIssued: formattedDate,
  };

  Object.entries(fields).forEach(([name, value]) => {
    form.getFields()
      .filter(f => f.getName() === name)
      .forEach(f => {
        f.setText(value);
        f.updateAppearances(garamondFont);
      });
  });

  form.flatten();

  return await pdfDoc.save();
}
