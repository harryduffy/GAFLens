import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts } from 'pdf-lib';

export async function generateSummaryPDF(summaryText, meeting) {
  const templatePath = path.join(process.cwd(), 'summaries', 'fund_summary-template.pdf');
  const templateBytes = fs.readFileSync(templatePath);

  const pdfDoc = await PDFDocument.load(templateBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const form = pdfDoc.getForm();

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB');
  form.getTextField('dateIssued').setText(formattedDate);

  const safe = (val) => val == null ? '' : String(val);
  const fields = {
    fundName: safe(meeting.fundName),
    fundSize: safe(meeting.fundSize),
    assetClass: safe(meeting.assetClasses),
    strategy: safe(meeting.investmentStrategies),
    targetNetIRR: safe(meeting.fundTargetNetReturn) + '%',
  };

  Object.entries(fields).forEach(([name, value]) => {
    form.getFields()
      .filter(f => f.getName() === name)
      .forEach(f => f.setText(value));
  });

  form.updateFieldAppearances(font);
  form.flatten();

  return await pdfDoc.save(); // returns Uint8Array buffer
}
