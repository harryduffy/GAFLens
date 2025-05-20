import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { writeSummaryToPDF } from '../../../utils/writeSummaryToPDF.js';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { meeting } = await req.json();

    const prompt = `
      Summarise the following manager meeting data in 3–4 concise bullet points:

      Fund Name: ${meeting.fundName}
      Fund Size: ${meeting.fundSize}
      Asset Classes: ${meeting.assetClasses}
      Strategies: ${meeting.investmentStrategies}
      Target Return: ${meeting.fundTargetNetReturn}%
      GAF Attendees: ${meeting.gafAttendees}
      External Attendees: ${meeting.externalAttendees}
    `;

    // Uncomment if/when you switch back to live GPT:
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [{ role: "user", content: prompt }],
    // });

    const completion = {
      choices: [{ message: { content: "A summary has been downloaded :)"} }]
    };

    const summaryText = completion.choices[0].message.content;

    // Generate the PDF
    const fileName = `summary-${meeting.fundName.replace(/\s+/g, '_')}.pdf`;
    const outputPath = path.join(process.cwd(), 'summaries', fileName);
    await writeSummaryToPDF(summaryText, outputPath, meeting);

    return new Response(JSON.stringify({ summary: summaryText, filePath: `/summaries/${fileName}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to summarise' }), { status: 500 });
  }
}