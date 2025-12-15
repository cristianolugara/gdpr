import { GdprRequestType } from "@/types/gdpr";

export const GDPR_TEMPLATES = {
    ['ACCESS' as GdprRequestType]: {
        title: "Risposta a Richiesta di Accesso (Art. 15 GDPR)",
        description: "Modello di risposta per confermare se i dati sono trattati e fornire i dettagli.",
        deadlineDays: 30,
        content: `Gentile {{requesterName}},

La ringraziamo per averci contattato riguardo alla sua richiesta di accesso ai dati personali ai sensi del Regolamento (UE) 2016/679 (GDPR).

{{#if hasData}}
Le confermiamo che trattiamo i suoi dati:

a) Finalità:
{{purposes}}

b) Categoria di dati:
{{dataCategories}}

c) Destinatari:
{{recipients}}

d) Periodo di conservazione dei dati:
{{retentionPeriod}}

e) Diritti dell'interessato:
Le ricordiamo che ha diritto a chiedere al titolare del trattamento la rettifica o la cancellazione dei dati personali o la limitazione del trattamento dei dati personali che la riguardano o di opporsi al loro trattamento; precisiamo altresì che {{companyName}} non potrà cancellare i dati utili alla propria tutela legale così come da art. 6, comma 1 lettera f) del GDPR (legittimo interesse).

f) Reclamo:
Se non soddisfatto ha diritto a proporre reclamo all’Autorità Garante per la protezione dei dati personali o all’autorità competente.

g) Origine dei dati:
{{dataOrigin}}

h) Processo decisionale automatizzato:
{{automatedDecisionInfo}}

i) Copia dei dati:
Ha il diritto ad ottenere una copia dei suoi dati che noi trattiamo facendone esplicita richiesta ed allegando un suo documento di identità in corso di validità.

[Il nostro DPO è {{dpoName}} reperibile all’indirizzo di posta elettronica {{dpoEmail}}.]
{{else}}
Le confermiamo che NESSUN dato che la riguarda è oggetto di trattamento da parte nostra.
{{/if}}

Cordiali saluti,

{{city}}, {{date}}
{{handlerName}} ({{handlerPosition}})
{{companyName}}`
    },

    ['RECTIFICATION' as GdprRequestType]: {
        title: "Risposta a Richiesta di Rettifica (Art. 16 GDPR)",
        description: "Modello di risposta per confermare l'avvenuta rettifica dei dati inesatti.",
        deadlineDays: 30,
        content: `Gentile {{requesterName}},

La ringraziamo per averci contattato riguardo alla sua richiesta di rettifica dei dati personali ai sensi del Regolamento (UE) 2016/679 (GDPR).

{{#if needsIdentityVerification}}
Per evadere la sua richiesta e per la sicurezza dei suoi dati, la invitiamo a fornirci un documento di identità in corso di validità.
{{/if}}

In base alla normativa GDPR, ha il diritto di chiedere la rettifica dei dati personali che La riguardano se questi sono inaccurati o incompleti.

La informiamo che procederemo a:
{{#if rectificationApproved}}
Rettificare i dati: la richiesta è giustificata e i dati sono stati rettificati.
{{else}}
Motivare il rifiuto: {{refusalReason}}
{{/if}}

[Il nostro DPO è {{dpoName}} reperibile all’indirizzo di posta elettronica {{dpoEmail}}.]

La ringraziamo per la Sua pazienza e rimaniamo a disposizione per ulteriori domande o chiarimenti.

Cordiali saluti,

{{city}}, {{date}}
{{handlerName}} ({{handlerPosition}})
{{companyName}}`
    },

    ['LIMITATION' as GdprRequestType]: {
        title: "Risposta a Richiesta di Limitazione (Art. 18 GDPR)",
        description: "Modello per congelare il trattamento dei dati in caso di contestazione.",
        deadlineDays: 30,
        content: `Gentile {{requesterName}},

La ringraziamo per averci contattato riguardo alla sua richiesta di limitazione del trattamento dei dati personali ai sensi del Regolamento (UE) 2016/679 (GDPR).

{{#if needsIdentityVerification}}
Per evadere la sua richiesta e per la sicurezza dei suoi dati, la invitiamo a fornirci un documento di identità in corso di validità.
{{/if}}

Fin quando i suoi dati saranno limitati:
a) risulteranno “limitati” nei nostri archivi;
b) potranno essere trattati solo col suo consenso, salvo che per la conservazione o per l'accertamento, l'esercizio o la difesa di un diritto in sede giudiziaria oppure per tutelare i diritti di un'altra persona fisica o giuridica o per motivi di interesse pubblico rilevante dell'Unione o di uno Stato membro;
c) le comunicheremo altresì se e quando cesseranno di essere limitati.

La informeremo dell'esito della sua richiesta entro un mese dalla data di ricezione.

[Il nostro DPO è {{dpoName}} reperibile all’indirizzo di posta elettronica {{dpoEmail}}.]

Cordiali saluti,

{{city}}, {{date}}
{{handlerName}} ({{handlerPosition}})
{{companyName}}`
    },

    ['PORTABILITY' as GdprRequestType]: {
        title: "Risposta a Richiesta di Portabilità (Art. 20 GDPR)",
        description: "Modello per l'invio dei dati in formato strutturato (CSV/XML).",
        deadlineDays: 30,
        content: `Gentile {{requesterName}},

La ringraziamo per averci contattato riguardo alla sua richiesta di portabilità dei dati personali ai sensi del Regolamento (UE) 2016/679 (GDPR).

Desideriamo informarla che stiamo elaborando la sua richiesta e che procederemo a fornirle una copia dei suoi dati personali in un formato strutturato, di uso comune e leggibile da un dispositivo automatico.

{{#if needsIdentityVerification}}
Per garantire la sicurezza dei suoi dati le chiediamo gentilmente di confermare l'identità del richiedente inviandoci un documento di identità in corso di validità.
{{/if}}

Se tecnicamente fattibile, può richiedere che la trasmissione dei dati venga fatta direttamente al titolare da lei indicato.

[Il nostro DPO è {{dpoName}} reperibile all’indirizzo di posta elettronica {{dpoEmail}}.]

Cordiali saluti,

{{city}}, {{date}}
{{handlerName}} ({{handlerPosition}})
{{companyName}}`
    },

    ['CANCELLATION' as GdprRequestType]: {
        title: "Risposta a Richiesta di Cancellazione / Oblio (Art. 17 GDPR)",
        description: "Modello per la cancellazione definitiva dei dati.",
        deadlineDays: 30,
        content: `Gentile {{requesterName}},

La ringraziamo per averci contattato riguardo alla sua richiesta di cancellazione dei dati personali ai sensi del Regolamento (UE) 2016/679 (GDPR).

Dopo aver esaminato la sua richiesta, le comunichiamo quanto segue:

{{#if cancellationApproved}}
**Cancellazione effettuata:** confermiamo che la richiesta è stata elaborata e i dati personali sono stati rimossi dai nostri archivi.

Per la nostra e la sua sicurezza le chiediamo di allegare un documento di identità al fine di verificare che sia lei il vero interessato. Se procederemo alla cancellazione richiesta, elimineremo anche tale documento dai nostri sistemi.
{{else}}
**Cancellazione non effettuata (o effettuata in maniera parziale):** non siamo in grado di procedere con la cancellazione per i seguenti motivi:
- {{cancellationRefusalReason}} (es. obbligo legale, difesa in giudizio, contratto in essere).

In questo caso comunicheremo la futura data di cancellazione prevista: {{futureCancellationDate}}.
{{/if}}

[Il nostro DPO è {{dpoName}} reperibile all’indirizzo di posta elettronica {{dpoEmail}}.]

Cordiali saluti,

{{city}}, {{date}}
{{handlerName}} ({{handlerPosition}})
{{companyName}}`
    }
};

export const DATA_BREACH_CHECKLIST = [
    {
        id: 'verify',
        step: "1. Notifica Interna",
        description: "Informare immediatamente i referenti privacy e il DPO (se presente)."
    },
    {
        id: 'assess_rid',
        step: "2. Valutazione R.I.D.",
        description: "Verificare l'impatto su Riservatezza, Integrità, Disponibilità. Determinare se c'è un rischio per i diritti e le libertà degli interessati."
    },
    {
        id: 'mitigate',
        step: "3. Contenimento",
        description: "Interrompere le cause della violazione (es. cambio password, isolamento server) e ripristinare i backup se necessario."
    },
    {
        id: 'notify_garante',
        step: "4. Notifica al Garante (entro 72h)",
        description: "Se c'è rischio per le persone, notificare al Garante Privacy tramite procedura telematica."
    },
    {
        id: 'notify_subjects',
        step: "5. Comunicazione agli Interessati",
        description: "Se il rischio è ALTO, comunicare la violazione anche alle persone coinvolte senza ritardo."
    },
    {
        id: 'record',
        step: "6. Registro Violazioni",
        description: "Aggiornare il registro delle violazioni (interno) indipendente dalla notifica al Garante."
    }
];
