
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { StaffRepository } from '@/lib/repositories/staff'
import { StaffMember } from '@/types/staff'

export type ActionState = {
    error?: string
    success?: string
}

export async function createStaffMember(formData: FormData): Promise<ActionState> {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'Non autorizzato' }
    }

    const rawData: Omit<StaffMember, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        email: formData.get('email') as string,
        role: formData.get('role') as string,
        employment_type: formData.get('employment_type') as 'INTERNAL' | 'EXTERNAL' | 'AUTONOMOUS',
        appointment_date: formData.get('appointment_date') ? new Date(formData.get('appointment_date') as string).toISOString() : undefined,
        has_signed_appointment: formData.get('has_signed_appointment') === 'on',
        has_signed_nda: formData.get('has_signed_nda') === 'on',
        status: formData.get('status') as 'ACTIVE' | 'TERMINATED' || 'ACTIVE',
    }

    if (!rawData.first_name || !rawData.last_name) {
        return { error: 'Nome e Cognome sono obbligatori' }
    }

    try {
        await StaffRepository.create(user.id, rawData)
        revalidatePath('/dashboard/staff')
        return { success: 'Membro aggiunto con successo' }
    } catch (error) {
        return { error: 'Errore durante il salvataggio' }
    }
}

export async function deleteStaffMember(id: string): Promise<ActionState> {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'Non autorizzato' }
    }

    try {
        await StaffRepository.delete(user.id, id)
        revalidatePath('/dashboard/staff')
        return { success: 'Membro eliminato' }
    } catch (error) {
        return { error: 'Errore durante l\'eliminazione' }
    }
}

export async function getStaffList() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    return await StaffRepository.getAll(user.id)
}
