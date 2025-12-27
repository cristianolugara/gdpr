export interface AuditQuestion {
    id: string;
    category: 'WEBSITE' | 'GENERAL' | 'SECURITY';
    question: string;
    description: string;
    weight: number; // Importance 1-3
    remediationAction: string; // What to do if answer is NO
}

export const WEBSITE_AUDIT_QUESTIONS: AuditQuestion[] = [
    {
        id: 'web_privacy_policy',
        category: 'WEBSITE',
        question: "È presente una Privacy Policy aggiornata sul sito?",
        description: "Il link deve essere visibile in ogni pagina (footer) e contenere tutte le info ex art. 13 GDPR.",
        weight: 3,
        remediationAction: "Genera e pubblica una Privacy Policy conforme."
    },
    {
        id: 'web_cookie_banner',
        category: 'WEBSITE',
        question: "È presente un Cookie Banner alla prima visita?",
        description: "Deve bloccare i cookie non tecnici prima del consenso e avere tasti 'Accetta' e 'Rifiuta' (X in alto a destra).",
        weight: 3,
        remediationAction: "Installa una CMP (Consent Management Platform) conforme alle linee guida 2021."
    },
    {
        id: 'web_cookie_policy',
        category: 'WEBSITE',
        question: "È presente una Cookie Policy specifica?",
        description: "Documento separato (o sezione) che elenca tutti i cookie, scadenze e terze parti.",
        weight: 2,
        remediationAction: "Censisci i cookie e crea la policy."
    },
    {
        id: 'web_forms_checkbox',
        category: 'WEBSITE',
        question: "I moduli di contatto hanno la checkbox per la presa visione dell'informativa?",
        description: "L'utente deve dichiarare di aver letto la policy prima di inviare dati. Non deve essere pre-spuntata.",
        weight: 2,
        remediationAction: "Aggiungi checkbox non pre-selezionata con link alla Privacy Policy nei form."
    },
    {
        id: 'web_marketing_consent',
        category: 'WEBSITE',
        question: "Richiedi consenso separato per Marketing/Newsletter?",
        description: "Se invii email commerciali, serve una checkbox specifica, libera e facoltativa.",
        weight: 3,
        remediationAction: "Aggiungi checkbox specifica 'Acconsento al marketing' non obbligatoria per il servizio base."
    },
    {
        id: 'web_https',
        category: 'WEBSITE',
        question: "Il sito utilizza il protocollo HTTPS sicuro?",
        description: "Tutti i dati scambiati devono essere crittografati.",
        weight: 3,
        remediationAction: "Installa un certificato SSL sul server."
    }
];

export const GENERAL_AUDIT_QUESTIONS: AuditQuestion[] = [
    {
        id: 'gen_register',
        category: 'GENERAL',
        question: "Hai compilato il Registro dei Trattamenti?",
        description: "File Excel o software che mappa tutti i dati trattati in azienda.",
        weight: 3,
        remediationAction: "Usa la sezione 'Registro Trattamenti' di questo tool per crearlo."
    },
    {
        id: 'gen_employees',
        category: 'GENERAL',
        question: "I dipendenti hanno firmato la Lettera di Incarico?",
        description: "Ogni chi tratta dati deve essere formalmente autorizzato e istruito.",
        weight: 2,
        remediationAction: "Vai su 'Staff & Nomine' e genera le lettere per tutti."
    },
    {
        id: 'gen_vendors',
        category: 'GENERAL',
        question: "Hai nominato i fornitori esterni (DPA)?",
        description: "Commercialista, Consulente Lavoro, Agenzie IT devono avere nomina art. 28.",
        weight: 3,
        remediationAction: "Vai su 'Fornitori', censisci i responsabili e scarica i DPA."
    },
    {
        id: 'gen_training',
        category: 'GENERAL',
        question: "È stata fatta formazione privacy nell'ultimo anno?",
        description: "La formazione deve essere periodica e documentata.",
        weight: 2,
        remediationAction: "Organizza una sessione formativa e registrala nella sezione 'Formazione'."
    },
    {
        id: 'sec_backups',
        category: 'SECURITY',
        question: "Effettui backup periodici dei dati?",
        description: "I dati devono essere ripristinabili in caso di incidente.",
        weight: 3,
        remediationAction: "Pianifica backup automatici e testali mensilmente."
    },
    {
        id: 'sec_pc_pwd',
        category: 'SECURITY',
        question: "I PC sono protetti da password personale?",
        description: "Ogni operatore deve avere le sue credenziali, non condivise.",
        weight: 2,
        remediationAction: "Imposta account nominali su tutti i computer aziendali."
    }
];
