'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { CompanyRepository } from '@/lib/repositories/companies'
import { CompanySettings } from '@/types/company'

export { type CompanySettings }

export async function saveCompanySettings(formData: FormData) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'Non autorizzato' }
    }

    const rawData: Omit<CompanySettings, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
        name: formData.get('name') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        zip_code: formData.get('zip_code') as string,
        vat_number: formData.get('vat_number') as string,
        tax_code: formData.get('tax_code') as string,
        email: formData.get('email') as string,
        pec: formData.get('pec') as string,
        phone: formData.get('phone') as string,
        legal_representative: formData.get('legal_representative') as string,
        dpo_name: formData.get('dpo_name') as string,
        dpo_email: formData.get('dpo_email') as string,
    }

    // Basic validation (can be improved)
    if (!rawData.name) {
        return { error: 'La Ragione Sociale è obbligatoria' }
    }

    try {
        await CompanyRepository.upsert(user.id, rawData)
    } catch (error) {
        return { error: 'Errore durante il salvataggio dei dati. Assicurati che la tabella "companies" esista.' }
    }

    revalidatePath('/dashboard/settings')
    return { success: 'Dati salvati con successo!' }
}

export async function getCompanySettings() {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return null
    }

    return await CompanyRepository.getByUserId(user.id)
}
