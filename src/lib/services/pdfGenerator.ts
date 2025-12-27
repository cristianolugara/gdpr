
import { jsPDF } from 'jspdf';
import { StaffMember } from '@/types/staff';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export const generateAppointmentLetter = (staff: StaffMember, companyName: string) => {
    const doc = new jsPDF();
    const currentDate = format(new Date(), 'd MMMM yyyy', { locale: it });

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('LETTERA DI NOMINA A PERSONA AUTORIZZATA', 20, 20);
    doc.text('AL TRATTAMENTO DEI DATI PERSONALI', 20, 28);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    // Body text based on Doc 12
    const bodyText = `
${companyName}, in qualità di Titolare del trattamento, conferisce al sig./sig.ra ${staff.first_name} ${staff.last_name}, l’incarico di compiere le operazioni di trattamento di seguito elencate, con l’avvertimento che dovrà operare osservando le direttive del Titolare.

OPERAZIONI DI TRATTAMENTO E LORO DESCRIZIONE:
${staff.processing_allowance || '[Nessuna istruzione specifica fornita. Inserire qui le operazioni consentite, es: archiviazione, accesso database...]'}

A tal fine, vengono fornite informazioni ed istruzioni per l’assolvimento del compito assegnato:

1) Il trattamento dei dati deve essere effettuato in modo lecito e corretto;
2) I dati personali devono essere raccolti e registrati unicamente per finalità inerenti l’attività svolta;
3) È necessaria la verifica costante dei dati ed il loro aggiornamento;
4) È necessaria la verifica costante della completezza e pertinenza dei dati trattati;
5) Devono essere rispettate le misure di sicurezza predisposte dal Titolare;
6) In ogni operazione del trattamento deve essere garantita la massima riservatezza ed in particolare: 
   a) divieto di comunicazione e/o diffusione dei dati senza la preventiva autorizzazione del Titolare; 
   b) l’accesso ai dati dovrà essere limitato all’espletamento delle proprie mansioni ed esclusivamente negli orari di lavoro; 
   c) la fase di raccolta del consenso dovrà essere preceduta dalla informativa ed il consenso rilascito in forma scritta;
7) In caso di interruzione anche temporanea del lavoro, verificare che i dati trattati non siano accessibili a terzi non autorizzati;
8) Le proprie credenziali di autenticazione devono essere riservate;
9) Svolgere le attività previste dai trattamenti secondo le direttive del Titolare;
10) Non modificare i trattamenti esistenti o introdurre nuovi trattamenti senza l’esplicita autorizzazione;
11) Rispettare e far rispettare le norme di sicurezza per la protezione dei dati personali;
12) Informare il Titolare/Responsabile in caso di incidente di sicurezza (Data Breach);
13) Raccogliere, registrare e conservare i dati presenti negli atti e documenti contenuti nei fascicoli e/o nei supporti informatici avendo cura che l’accesso ad essi sia possibile solo ai soggetti autorizzati;
14) I dati personali interni all’azienda non possono essere portati all’esterno del luogo di lavoro;
15) Eseguire qualsiasi altra operazione di trattamento nei limiti delle proprie mansioni e nel rispetto delle norme di legge;
16) Qualsiasi altra informazione può essere fornita dal Titolare che provvede anche alla formazione.

Gli obblighi relativi alla riservatezza, alla comunicazione ed alla diffusione dovranno essere osservati anche in seguito a modifica dell’incarico e /o cessazione del rapporto di lavoro.

Si rimanda per tutto quanto non chiaramente specificato nella presente lettera di incarico al rispetto di quanto prescritto dal GDPR.

Luogo e Data: ${currentDate}

Firma per accettazione                                              Il Titolare del Trattamento
(Persona designata)                                                    (${companyName})

_________________________                                  _________________________
`;

    // Split text to fit page
    const splitText = doc.splitTextToSize(bodyText, 170);
    doc.text(splitText, 20, 40);

    return doc;
};

export const generateDPA = (vendor: any, companyName: string, companyVat: string) => {
    const doc = new jsPDF();
    const currentDate = format(new Date(), 'd MMMM yyyy', { locale: it });

    // HEADER
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DATA PROCESSING AGREEMENT (NOMINA A RESPONSABILE)', 20, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Ai sensi dell\'art. 28 del Regolamento UE 2016/679 (GDPR)', 20, 26);

    // PARTIES
    const partiesText = `
TRA
${companyName} (P.IVA: ${companyVat}), in qualità di Titolare del Trattamento ("Titolare")
E
${vendor.name} (P.IVA: ${vendor.vatNumber || '___________'}), in qualità di Responsabile del Trattamento ("Responsabile")

PREMESSO CHE
(A) Il Titolare affida al Responsabile alcuni servizi che implicano il trattamento di dati personali.
(B) Le Parti intendono sottoscrivere il presente accordo per conformarsi all'art. 28 del GDPR.
    `;
    doc.setFontSize(11);
    const splitParties = doc.splitTextToSize(partiesText, 170);
    doc.text(splitParties, 20, 35);

    // AGREEMENT BODY (Based on the provided English template, translated & adapted)
    const bodyText = `
SI CONVIENE E SI STIPULA QUANTO SEGUE:

1. DEFINIZIONI
I termini "Titolare", "Responsabile", "Dati Personali", "Trattamento", "Interessato" hanno il significato definito nel GDPR.

2. OGGETTO DEL TRATTAMENTO
Il Responsabile è autorizzato a trattare i dati personali per conto del Titolare esclusivamente per l'esecuzione dei servizi di: ${vendor.serviceType || '__________'} ("Servizi") e secondo le istruzioni documentate del Titolare.

3. OBBLIGHI DEL RESPONSABILE
Il Responsabile si impegna a:
3.1 Trattare i dati solo su istruzione documentata del Titolare.
3.2 Garantire che le persone autorizzate al trattamento si siano impegnate alla riservatezza.
3.3 Adottare tutte le misure di sicurezza richieste dall'art. 32 del GDPR (misure tecniche e organizzative adeguate).
3.4 Non ricorrere a un altro responsabile (Sub-responsabile) senza previa autorizzazione scritta del Titolare.
3.5 Assistere il Titolare con misure tecniche e organizzative adeguate per soddisfare le richieste degli interessati (es. diritto di accesso, cancellazione).
3.6 Assistere il Titolare nel garantire il rispetto degli obblighi di cui agli artt. 32-36 (sicurezza, notifica violazioni, DPIA).
3.7 Cancellare o restituire tutti i dati personali al termine della prestazione dei servizi, salvo obblighi di legge.
3.8 Mettere a disposizione le informazioni necessarie per dimostrare la conformità e contribuire a revisioni/ispezioni.

4. TRASFERIMENTI DATI EXTRA-UE
Il Responsabile non trasferirà dati fuori dallo Spazio Economico Europeo (SEE) senza il previo consenso scritto del Titolare e senza garanzie adeguate (es. Clausole Contrattuali Standard).
Paesi trasferimenti attuali: ${vendor.dataTransferInfo || 'Nessuno / Solo UE'}.

5. VIOLAZIONE DEI DATI (DATA BREACH)
Il Responsabile notifica al Titolare qualsiasi violazione dei dati personali senza ingiustificato ritardo dopo averne avuto conoscenza.

6. DURATA L'accordo è valido per tutta la durata del contratto di servizi principale.

Luogo e Data: ${currentDate}

IL TITOLARE                                                  IL RESPONSABILE
${companyName}                                             ${vendor.name}

___________________________                         ___________________________
    `;

    doc.setFontSize(10);
    // Add text slightly lower to account for previous block
    const splitBody = doc.splitTextToSize(bodyText, 170);
    // Start body at roughly 80y (35 + height of parties ~40)
    doc.text(splitBody, 20, 80);

    return doc;
};
