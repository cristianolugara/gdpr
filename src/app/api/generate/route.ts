import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    try {
        const { companyName, websiteUrl, dataTypes, docType } = await req.json();

        if (!companyName) {
            return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
        }

        const prompt = `
      Genera in formato Markdown un documento "${docType || 'Privacy Policy'}" completo e conforme al GDPR per la seguente azienda:
      
      Nome Azienda: ${companyName}
      Sito Web: ${websiteUrl || 'Non specificato'}
      Dati Trattati: ${dataTypes?.join(', ') || 'Dati standard di navigazione'}
      
      Il documento deve includere:
      1. Titolare del trattamento
      2. Tipologie di dati
      3. Finalità e base giuridica
      4. Destinatari dei dati
      5. Trasferimento dati extra UE
      6. Diritti degli interessati
      
      Usa un tono professionale e giuridico.
    `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "Sei un esperto legale specializzato in GDPR e protezione dei dati." },
                { role: "user", content: prompt }
            ],
        });

        const content = completion.choices[0].message.content;

        return NextResponse.json({ content });
    } catch (error) {
        console.error('OpenAI Error:', error);
        return NextResponse.json({ error: 'Errore durante la generazione del documento.' }, { status: 500 });
    }
}
