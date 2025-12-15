import { createClient } from '@/lib/supabase/server'
import {
    ProcessingActivity,
    GdprSubjectRequest,
    DataBreachIncident
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
    }
}
