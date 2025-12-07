import { createClient } from '@/lib/supabase/server'
import { CompanySettings } from '@/types/company'

export const CompanyRepository = {
    async getByUserId(userId: string): Promise<CompanySettings | null> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('user_id', userId)
            .single()

        if (error) {
            if (error.code !== 'PGRST116') { // PGRST116 is 'Row not found'
                console.error('Error fetching company:', error)
            }
            return null
        }

        return data as CompanySettings
    },

    async upsert(userId: string, data: Omit<CompanySettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
        const supabase = await createClient()

        // Check if exists
        const existing = await this.getByUserId(userId)

        let error
        if (existing) {
            const { error: updateError } = await supabase
                .from('companies')
                .update({
                    ...data,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', userId)
            error = updateError
        } else {
            const { error: insertError } = await supabase
                .from('companies')
                .insert({
                    user_id: userId,
                    ...data,
                })
            error = insertError
        }

        if (error) {
            console.error('Error upserting company:', error)
            throw new Error('Database error during save')
        }

        return true
    }
}
