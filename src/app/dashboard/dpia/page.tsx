import { createClient } from '@/lib/supabase/server'
import { GdprRepository } from '@/lib/repositories/gdpr'
import { redirect } from 'next/navigation'
import DpiaClient from './DpiaClient'

export default async function DpiaPage() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login')
    }

    const dpias = await GdprRepository.getDpias(user.id)

    return <DpiaClient initialDpias={dpias} />
}
