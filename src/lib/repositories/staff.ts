
import { createClient } from '@/lib/supabase/server'
import { StaffMember } from '@/types/staff'

export const StaffRepository = {
    async getAll(userId: string): Promise<StaffMember[]> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('gdpr_staff')
            .select('*')
            .eq('user_id', userId)
            .order('last_name', { ascending: true })

        if (error) {
            console.error('Error fetching staff:', error)
            return []
        }

        return data as StaffMember[]
    },

    async create(userId: string, data: Omit<StaffMember, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
        const supabase = await createClient()
        const { data: newMember, error } = await supabase
            .from('gdpr_staff')
            .insert({
                user_id: userId,
                ...data,
            })
            .select() // Important to return the created object
            .single()

        if (error) {
            console.error('Error creating staff member:', error)
            throw new Error('Database error')
        }

        return newMember
    },

    async update(userId: string, id: string, data: Partial<StaffMember>) {
        const supabase = await createClient()
        const { error } = await supabase
            .from('gdpr_staff')
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .eq('user_id', userId)

        if (error) {
            console.error('Error updating staff member:', error)
            throw new Error('Database error')
        }

        return true
    },

    async delete(userId: string, id: string) {
        const supabase = await createClient()
        const { error } = await supabase
            .from('gdpr_staff')
            .delete()
            .eq('id', id)
            .eq('user_id', userId)

        if (error) {
            console.error('Error deleting staff member:', error)
            throw new Error('Database error')
        }

        return true
    }
}
