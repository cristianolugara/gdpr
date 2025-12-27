
export type StaffMember = {
    id: string
    user_id: string
    first_name: string
    last_name: string
    email?: string
    role?: string
    employment_type: 'INTERNAL' | 'EXTERNAL' | 'AUTONOMOUS'
    is_system_admin: boolean
    is_privacy_ref: boolean
    processing_allowance?: string
    appointment_date?: string
    has_signed_appointment: boolean
    appointment_doc_id?: string
    has_signed_nda: boolean
    nda_doc_id?: string
    status: 'ACTIVE' | 'TERMINATED'
    created_at: string
    updated_at: string
}
