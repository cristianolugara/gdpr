import { createClient } from '@/lib/supabase/server'
import {
    ProcessingActivity,
    GdprSubjectRequest,
    DataBreachIncident,
    GdprVendor,
    GdprTraining,
    GdprAuditLog
} from '@/types/gdpr'

export const GdprRepository = {
    // --- Processing Activities (Register) ---
    async getActivities(userId: string): Promise<ProcessingActivity[]> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('gdpr_processing_activities')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching activities:', error)
            return []
        }

        return data.map((item: any) => ({
            id: item.id,
            companyId: item.user_id,
            name: item.name,
            description: item.description,
            purpose: item.purpose,
            legalBasis: item.legal_basis,
            dataSubjects: item.data_subjects,
            dataCategories: item.data_categories,
            dataCategoriesDetails: item.data_categories_details,
            recipients: item.recipients,
            transfers: {
                isTransferred: item.transfers_info?.isTransferred || false,
                countries: item.transfers_info?.countries || [],
                safeguards: item.transfers_info?.safeguards || ''
            },
            retentionPeriod: item.retention_period,
            securityMeasures: item.security_measures,
            status: item.status,
            createdAt: item.created_at,
            updatedAt: item.updated_at
        })) as ProcessingActivity[]
    },

    async createActivity(activity: Omit<ProcessingActivity, 'id' | 'createdAt' | 'updatedAt'>) {
        const supabase = await createClient()
        // Map camelCase to snake_case for DB is handled automatically if we matched types? 
        // No, DB cols are snake_case (e.g. user_id, legal_basis). Types are camelCase.
        // I need to map them manually or use a helper. 
        // For simplicity allow me to check the Schema I wrote.
        // schema: legal_basis, data_subjects, etc.
        // type: legalBasis, dataSubjects.

        // I will do manual mapping for safety.
        const dbData = {
            user_id: activity.companyId, // Assuming companyId maps to user_id for now based on RLS patterns seen
            name: activity.name,
            description: activity.description,
            purpose: activity.purpose,
            legal_basis: activity.legalBasis,
            data_subjects: activity.dataSubjects,
            data_categories: activity.dataCategories,
            data_categories_details: activity.dataCategoriesDetails,
            recipients: activity.recipients,
            transfers_info: activity.transfers,
            retention_period: activity.retentionPeriod,
            security_measures: activity.securityMeasures,
            status: activity.status
        }

        const { data, error } = await supabase
            .from('gdpr_processing_activities')
            .insert(dbData)
            .select()
            .single()

        if (error) {
            console.error('Error creating activity:', error)
            throw error
        }
        return data
    },

    // --- Subject Requests ---
    async getRequests(userId: string): Promise<GdprSubjectRequest[]> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('gdpr_subject_requests')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching requests:', error)
            return []
        }

        // Map back to camelCase
        return data.map((item: any) => ({
            id: item.id,
            companyId: item.user_id,
            type: item.type,
            status: item.status,
            requesterName: item.requester_name,
            requesterEmail: item.requester_email,
            requestDate: item.request_date,
            deadlineDate: item.deadline_date,
            isIdentityVerified: item.is_identity_verified,
            notes: item.notes,
            responseDocumentUrl: item.response_document_url,
            createdAt: item.created_at,
            updatedAt: item.updated_at
        }))
    },

    // --- Data Breaches ---
    async getBreaches(userId: string): Promise<DataBreachIncident[]> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('gdpr_data_breaches')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching breaches:', error)
            return []
        }

        // Map back to camelCase
        return data.map((item: any) => ({
            id: item.id,
            companyId: item.user_id,
            detectionDate: item.detection_date,
            notificationDeadline: item.notification_deadline,
            description: item.description,
            affectedDataCategories: item.affected_data_categories,
            affectedSubjectsCount: item.affected_subjects_count,
            confidentialityCompromised: item.confidentiality_compromised,
            integrityCompromised: item.integrity_compromised,
            availabilityCompromised: item.availability_compromised,
            riskAssessments: {
                rightsAndFreedoms: item.risk_assessment?.rightsAndFreedoms || 'NONE',
                justification: item.risk_assessment?.justification || ''
            },
            actionsTaken: item.actions_taken,
            isGaranteNotified: item.is_garante_notified,
            garanteNotificationDate: item.garante_notification_date,
            isSubjectsNotified: item.is_subjects_notified,
            status: item.status,
            createdAt: item.created_at,
            updatedAt: item.updated_at
        }))
    },

    async createRequest(request: Omit<GdprSubjectRequest, 'id' | 'createdAt' | 'updatedAt'>) {
        const supabase = await createClient()
        const dbData = {
            user_id: request.companyId,
            type: request.type,
            status: request.status,
            requester_name: request.requesterName,
            requester_email: request.requesterEmail,
            request_date: request.requestDate,
            deadline_date: request.deadlineDate,
            is_identity_verified: request.isIdentityVerified,
            notes: request.notes,
            response_document_url: request.responseDocumentUrl
        }

        const { data, error } = await supabase
            .from('gdpr_subject_requests')
            .insert(dbData)
            .select()
            .single()

        if (error) {
            console.error('Error creating request:', error)
            throw error
        }
        return data
    },

    async createBreach(breach: Omit<DataBreachIncident, 'id' | 'createdAt' | 'updatedAt'>) {
        const supabase = await createClient()
        const dbData = {
            user_id: breach.companyId,
            detection_date: breach.detectionDate,
            notification_deadline: breach.notificationDeadline,
            description: breach.description,
            affected_data_categories: breach.affectedDataCategories,
            affected_subjects_count: breach.affectedSubjectsCount,
            confidentiality_compromised: breach.confidentialityCompromised,
            integrity_compromised: breach.integrityCompromised,
            availability_compromised: breach.availabilityCompromised,
            risk_assessment: breach.riskAssessments,
            actions_taken: breach.actionsTaken,
            is_garante_notified: breach.isGaranteNotified,
            garante_notification_date: breach.garanteNotificationDate,
            is_subjects_notified: breach.isSubjectsNotified,
            status: breach.status
        }

        const { data, error } = await supabase
            .from('gdpr_data_breaches')
            .insert(dbData)
            .select()
            .single()

        if (error) {
            console.error('Error creating breach:', error)
            throw error
        }
        return data
    },

    // --- Vendors ---
    async getVendors(userId: string): Promise<GdprVendor[]> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('gdpr_vendors')
            .select('*')
            .eq('user_id', userId)
            .order('name', { ascending: true })

        if (error) return []

        return data.map((item: any) => ({
            id: item.id,
            companyId: item.user_id,
            name: item.name,
            serviceType: item.service_type,
            contactInfo: item.contact_info,
            dpaStatus: item.dpa_status,
            dpaDocumentId: item.dpa_document_id,
            securityAssessmentStatus: item.security_assessment_status,
            lastAssessmentDate: item.last_assessment_date,
            nextAssessmentDate: item.next_assessment_date,
            notes: item.notes,
            createdAt: item.created_at,
            updatedAt: item.updated_at
        }))
    },

    async createVendor(vendor: Omit<GdprVendor, 'id' | 'createdAt' | 'updatedAt'>) {
        const supabase = await createClient()
        const dbData = {
            user_id: vendor.companyId,
            name: vendor.name,
            service_type: vendor.serviceType,
            contact_info: vendor.contactInfo,
            dpa_status: vendor.dpaStatus,
            dpa_document_id: vendor.dpaDocumentId,
            security_assessment_status: vendor.securityAssessmentStatus,
            last_assessment_date: vendor.lastAssessmentDate,
            next_assessment_date: vendor.nextAssessmentDate,
            notes: vendor.notes
        }

        const { data, error } = await supabase.from('gdpr_vendors').insert(dbData).select().single()
        if (error) throw error
        return data
    },

    // --- Training ---
    async getTraining(userId: string): Promise<GdprTraining[]> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('gdpr_training')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })

        if (error) return []

        return data.map((item: any) => ({
            id: item.id,
            companyId: item.user_id,
            title: item.title,
            description: item.description,
            date: item.date,
            durationMinutes: item.duration_minutes,
            attendees: item.attendees,
            materialsDocumentId: item.materials_document_id,
            createdAt: item.created_at
        }))
    },

    async createTraining(training: Omit<GdprTraining, 'id' | 'createdAt'>) {
        const supabase = await createClient()
        const dbData = {
            user_id: training.companyId,
            title: training.title,
            description: training.description,
            date: training.date,
            duration_minutes: training.durationMinutes,
            attendees: training.attendees,
            materials_document_id: training.materialsDocumentId
        }
        const { data, error } = await supabase.from('gdpr_training').insert(dbData).select().single()
        if (error) throw error
        return data
    },

    // --- Audits ---
    async getAuditLogs(userId: string): Promise<GdprAuditLog[]> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('gdpr_audit_logs')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })

        if (error) return []

        return data.map((item: any) => ({
            id: item.id,
            companyId: item.user_id,
            type: item.type,
            status: item.status,
            date: item.date,
            performedBy: item.performed_by,
            notes: item.notes,
            nextCheckDate: item.next_check_date,
            evidenceDocumentId: item.evidence_document_id,
            createdAt: item.created_at
        }))
    },

    async createAuditLog(log: Omit<GdprAuditLog, 'id' | 'createdAt'>) {
        const supabase = await createClient()
        const dbData = {
            user_id: log.companyId,
            type: log.type,
            status: log.status,
            date: log.date,
            performed_by: log.performedBy,
            notes: log.notes,
            next_check_date: log.nextCheckDate,
            evidence_document_id: log.evidenceDocumentId
        }
        const { data, error } = await supabase.from('gdpr_audit_logs').insert(dbData).select().single()
        if (error) throw error
        return data
    },

    // --- DPIA (Data Protection Impact Assessment) ---
    async getDpias(userId: string): Promise<import('@/types/gdpr').GdprDpia[]> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('gdpr_dpia')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) return []

        return data.map((item: any) => ({
            id: item.id,
            companyId: item.user_id,
            name: item.name,
            description: item.description,
            isLargeScale: item.is_large_scale,
            isProfiling: item.is_profiling,
            isPublicMonitoring: item.is_public_monitoring,
            isMandatory: item.is_mandatory,
            riskDescription: item.risk_description,
            likelihoodScore: item.likelihood_score,
            severityScore: item.severity_score,
            riskLevel: item.risk_level,
            mitigationMeasures: item.mitigation_measures,
            residualRiskLevel: item.residual_risk_level,
            dpoOpinion: item.dpo_opinion,
            status: item.status,
            createdAt: item.created_at,
            updatedAt: item.updated_at
        }))
    },

    async createDpia(dpia: Omit<import('@/types/gdpr').GdprDpia, 'id' | 'createdAt' | 'updatedAt'>) {
        const supabase = await createClient()
        const dbData = {
            user_id: dpia.companyId,
            name: dpia.name,
            description: dpia.description,
            is_large_scale: dpia.isLargeScale,
            is_profiling: dpia.isProfiling,
            is_public_monitoring: dpia.isPublicMonitoring,
            is_mandatory: dpia.isMandatory,
            risk_description: dpia.riskDescription,
            likelihood_score: dpia.likelihoodScore,
            severity_score: dpia.severityScore,
            risk_level: dpia.riskLevel,
            mitigation_measures: dpia.mitigationMeasures,
            residual_risk_level: dpia.residualRiskLevel,
            dpo_opinion: dpia.dpoOpinion,
            status: dpia.status
        }
        const { data, error } = await supabase.from('gdpr_dpia').insert(dbData).select().single()
        if (error) throw error
        return data
    }
}
