import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts } from 'pdf-lib';

export async function writeSummaryToPDF(summaryText, outputPath, meeting) {
  const templatePath = path.join(process.cwd(), 'summaries', 'fund_summary-template.pdf');
  const templateBytes = fs.readFileSync(templatePath);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB')
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const fundNameValue = meeting.fundName || '';
  form.getTextField('fundName').setText(fundNameValue);

  const fundNameFields = form.getFields().filter(f => f.getName() === 'fundName');
  fundNameFields.forEach(field => field.setText(fundNameValue));
  form.getTextField('fundSize').setText(String(meeting.fundSize) || '');
  form.getTextField('assetClass').setText(meeting.assetClasses || '');
  form.getTextField('strategy').setText(meeting.investmentStrategies || '');
  form.getTextField('targetNetIRR').setText(String(meeting.fundTargetNetReturn) + "%" || '');

  form.updateFieldAppearances(font);
  form.flatten();

  const pdfBytes = await pdfDoc.save();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, pdfBytes);
}
