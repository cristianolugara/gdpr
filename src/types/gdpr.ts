export type GdprRequestType =
    | 'ACCESS'
    | 'RECTIFICATION'
    | 'LIMITATION'
    | 'PORTABILITY'
    | 'CANCELLATION';

export type GdprRequestStatus =
    | 'NEW'
    | 'VERIFYING_IDENTITY'
    | 'PROCESSING'
    | 'COMPLETED'
    | 'REJECTED';

export interface GdprSubjectRequest {
    id: string;
    companyId: string;
    type: GdprRequestType;
    status: GdprRequestStatus;
    requesterName: string;
    requesterEmail: string;
    requestDate: string; // ISO Date
    deadlineDate: string; // ISO Date (usually +30 days)
    isIdentityVerified: boolean;
    notes?: string;
    responseDocumentUrl?: string; // Link to the generated PDF
    createdAt: string;
    updatedAt: string;
}

export type DataBreachSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type DataBreachRiskLevel = 'NONE' | 'LOW' | 'HIGH';

export interface DataBreachIncident {
    id: string;
    companyId: string;
    detectionDate: string; // ISO Date
    notificationDeadline: string; // Detection + 72h
    description: string;
    affectedDataCategories: string[];
    affectedSubjectsCount: number; // Approximate

    // R.I.D. Assessment
    confidentialityCompromised: boolean;
    integrityCompromised: boolean;
    availabilityCompromised: boolean;

    riskAssessments: {
        rightsAndFreedoms: DataBreachRiskLevel;
        justification: string;
    };

    actionsTaken: string[];
    isGaranteNotified: boolean;
    garanteNotificationDate?: string;
    isSubjectsNotified: boolean;

    status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'ARCHIVED';
    createdAt: string;
    updatedAt: string;
}

export type LegalBasis =
    | 'CONSENT'
    | 'CONTRACT'
    | 'LEGAL_OBLIGATION'
    | 'VITAL_INTERESTS'
    | 'PUBLIC_TASK'
    | 'LEGITIMATE_INTEREST';

export type DataCategory = 'COMMON' | 'PARTICULAR' | 'JUDICIAL';

export interface ProcessingActivity {
    id: string;
    companyId: string;
    name: string;
    description?: string;

    // Art. 30 (1) (b)
    purpose: string;
    legalBasis: LegalBasis;

    // Art. 30 (1) (c)
    dataSubjects: string[]; // e.g., Dependents, Clients
    dataCategories: DataCategory[];
    dataCategoriesDetails: string; // Specifics (e.g., "Email, CF")

    // Art. 30 (1) (d)
    recipients: string[]; // e.g., "HR Dept", "External Accountant"

    // Art. 30 (1) (e)
    transfers: {
        isTransferred: boolean;
        countries?: string[];
        safeguards?: string; // e.g. "SCC", "Privacy Shield" (defunct but example)
    };

    // Art. 30 (1) (f)
    retentionPeriod: string;

    // Art. 30 (1) (g)
    securityMeasures: string[]; // e.g. "Encryption", "MFA"

    status: 'ACTIVE' | 'ARCHIVED' | 'PLANNED';
    owner?: string; // Responsible person
    createdAt: string;
    updatedAt: string;
}
