import { createClient } from "@/lib/supabase/server"
import { GdprRepository } from "@/lib/repositories/gdpr"
import RequestsClient from "./RequestsClient"

export default async function RequestsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Autenticazione richiesta</div>
    }

    const requests = await GdprRepository.getRequests(user.id)
    const { data: profile } = await supabase.from('profiles').select('full_name, company_name').eq('id', user.id).single()

    return (
        <RequestsClient
            initialRequests={requests}
            userName={profile?.full_name}
            companyName={profile?.company_name}
        />
    )
}

