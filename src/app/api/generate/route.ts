import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    try {
        const reqData = await req.json();
        const { companyName, websiteUrl, dataTypes, docType } = reqData;

        if (!companyName) {
            return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
        }

        const prompt = `
      Genera in formato Markdown un documento "${docType || 'Privacy Policy'}" completo, professionale e strettamente conforme al GDPR per la seguente azienda.
      
      DATI TITOLARE:
      - Nome Azienda: ${companyName}
      - Sito Web: ${websiteUrl || 'Non specificato'}
      - Email Contatto: ${reqData.email || 'Non specificata'}
      - Indirizzo Sede: ${reqData.address || 'Non specificato'}
      - P.IVA / C.F.: ${reqData.vatId || 'Non specificato'}
      
      DATI TRATTATI:
      ${dataTypes?.join(', ') || 'Dati standard di navigazione, Cookie tecnici'}
      
      STRUTTURA OBBLIGATORIA DEL DOCUMENTO (Usa questi esatti titoli):
      
      1. Titolare del Trattamento
         - Indicare chiaramente i dati del titolare sopra riportati.
         
      2. Tipologie di Dati raccolti
         - Elencare i dati forniti volontariamente (es. form contatti, newsletter).
         - Elencare i dati di navigazione e cookie.
         
      3. Modalità e luogo del trattamento
         - Modalità: strumenti informatici/telematici, misure di sicurezza.
         - Luogo: sede del Titolare e server (indicare se UE o extra-UE).
         - Periodo di conservazione: quanto strettamente necessario.
         
      4. Finalità del Trattamento dei Dati raccolti
         - Es. Contattare l'utente, Gestione indirizzi, Statistica, Remarketing, ecc.
         
      5. Dettagli sul trattamento dei Dati Personali
         - Seleziona e descrivi i servizi pertinenti in base ai dati indicati (es. Google Analytics, Facebook Pixel, Modulo di contatto).
         - Per ogni servizio indicare: Dati Personali trattati e Luogo del trattamento.
         
      6. Diritti dell'Utente
         - Elenco puntato dei diritti (accesso, rettifica, cancellazione, limitazione, portabilità, opposizione, reclamo).
         - Modalità di esercizio dei diritti (es. scrivendo all'email del titolare).
         
      7. Ulteriori informazioni sul trattamento
         - Difesa in giudizio.
         - Log di sistema e manutenzione.
         - Modifiche a questa privacy policy.
         
      8. Definizioni e riferimenti legali
         - Definizione di Dati Personali, Utilizzo, Utente, Titolare, ecc.
         - Riferimenti al Regolamento (UE) 2016/679 (GDPR).
         
      Usa un linguaggio giuridico preciso ma comprensibile. Formatta con titoli H2 (##) per le sezioni e H3 (###) per i sottopunti.
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
