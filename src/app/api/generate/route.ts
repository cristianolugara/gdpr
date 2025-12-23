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

      let structureInstruction = '';

      if (docType && (docType.includes('Privacy') || docType.includes('Cookie'))) {
         structureInstruction = `
            STRUTTURA OBBLIGATORIA (Privacy/Cookie Policy):
            
            ## 1. Titolare del Trattamento
            Dati completi e contatti (incluso DPO se c'è).
            
            ## 2. Tipologie di Dati Raccolti
            Distinzione (Volontari, Navigazione, Cookie).
            
            ## 3. Finalità e Basi Giuridiche
            Specificare: Strumentali, Contrattuali, Marketing (Consenso), Soft Spam (Legittimo Interesse), Obblighi Legali.
            
            ## 4. Modalità e Luogo
            Misure di sicurezza, Luogo (UE/Extra UE con garanzie).
            
            ## 5. Periodo di Conservazione
            10 anni (amministrativi), revoca consenso (marketing), sessione (tecnici).
            
            ## 6. Diritti dell'Interessato
            Elenco artt. 15-22 GDPR e modalità contatto (risposta in 30gg).
            `;
      } else if (docType && (docType.includes('DPIA') || docType.includes('Valutazione'))) {
         structureInstruction = `
            STRUTTURA OBBLIGATORIA (DPIA - Valutazione d'Impatto art. 35):
            
            ## 1. Descrizione Sistematica del Trattamento
            Natura, ambito, contesto e finalità.
            
            ## 2. Valutazione di Necessità e Proporzionalità
            Perché il trattamento è indispensabile.
            
            ## 3. Valutazione dei Rischi
            Analisi dei rischi per diritti e libertà (Probabilità x Gravità).
            
            ## 4. Misure Previste (Mitigazione)
            Misure tecniche e organizzative per ridurre i rischi (es. pseudonimizzazione, cifratura).
            
            ## 5. Parere del DPO
            Spazio per le osservazioni del DPO.
            `;
      } else if (docType && (docType.includes('Nomina') || docType.includes('DPA'))) {
         structureInstruction = `
            STRUTTURA OBBLIGATORIA (Nomina Responsabile del Trattamento art. 28):
            
            ## 1. Oggetto e Durata
            Descrizione del servizio affidato e durata del trattamento.
            
            ## 2. Natura e Finalità
            Perché il Responsabile tratta i dati per conto del Titolare.
            
            ## 3. Tipologia Dati e Interessati
            Categorie di dati e soggetti coinvolti.
            
            ## 4. Obblighi del Responsabile
            - Trattare dati solo su istruzione.
            - Garantire riservatezza e sicurezza.
            - Assistere il Titolare (es. Data Breach, Diritti interessati).
            - Cancellazione/Restituzione a fine rapporto.
            
            ## 5. Obblighi del Titolare
            Istruzioni e controllo.
            `;
      } else {
         structureInstruction = `
            STRUTTURA GENERICA COMPLIANT GDPR:
            1. Oggetto
            2. Finalità
            3. Riferimenti Normativi (Reg UE 2016/679)
            4. Contenuto specifico richiesto
            `;
      }

      const prompt = `
      Agisci come un esperto consulente legale specializzato in GDPR (Regolamento UE 2016/679).
      Genera un documento "${docType || 'Privacy Policy'}" in formato Markdown, utilizzando un tono professionale ma chiaro (come suggerito dal manuale "Legal for Digital"), evitando il "legalese" inutile ma mantenendo rigore giuridico.
      
      DATI AZIENDALI (TITOLARE DEL TRATTAMENTO):
      - Azienda/Titolare: ${companyName}
      - Sito Web: ${websiteUrl || 'da inserire'}
      - Email Titolare: ${reqData.email || 'privacy@azienda.com'}
      - Indirizzo Sede: ${reqData.address || 'Indirizzo completo'}
      - P.IVA / C.F.: ${reqData.vatId || 'Codice Fiscale/P.IVA'}
      
      TIPOLOGIE DI DATI TRATTATI (INPUT UTENTE):
      ${dataTypes?.join(', ') || 'Dati di navigazione, Cookie, Dati comuni da form contatti'}
      
      ISTRUZIONI SPECIFICHE DAL MANUALE OPERATIVO GDPR:
      1. PRINCIPI: Rispetta i principi di liceità, correttezza, trasparenza, minimizzazione e limitazione della conservazione.
      2. SOFT SPAM (DEM): Se l'attività è un e-commerce o prevede vendita, includi la clausola "Soft Spam" (invio promozioni di prodotti analoghi a clienti già acquisiti senza bisogno di nuovo consenso, basato sul Legittimo Interesse).
      3. COOKIE: Se generi una Cookie Policy, specifica che non esiste "accettazione per scrolling" e che i cookie di profilazione richiedono consenso esplicito (banner).
      4. TERMINI DI CONSERVAZIONE: 
         - Dati contrattuali/amministrativi: 10 anni (obblighi di legge).
         - Marketing: Tempo congruo (es. 24 mesi o fino a revoca).
         - Soft Spam: Fino ad opposizione dell'interessato.
      5. DIRITTI: Elenca puntualmente i diritti (Accesso, Rettifica, Cancellazione, Limitazione, Portabilità, Opposizione) e specifica che il Titolare risponde entro 30 giorni.

      ${structureInstruction}
      
      Formattazione: Markdown pulito. Usa grassetti per concetti chiave.
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
