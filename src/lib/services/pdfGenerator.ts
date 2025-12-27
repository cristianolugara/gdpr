
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
