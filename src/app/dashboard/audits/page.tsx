import { createClient } from "@/lib/supabase/server"
import { GdprRepository } from "@/lib/repositories/gdpr"
import AuditsClient from "./AuditsClient"

export default async function AuditsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Autenticazione richiesta</div>
    }

    const logs = await GdprRepository.getAuditLogs(user.id)

    return (
        <AuditsClient initialLogs={logs} />
    )
}
