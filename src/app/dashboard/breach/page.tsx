import { createClient } from "@/lib/supabase/server"
import { GdprRepository } from "@/lib/repositories/gdpr"
import BreachClient from "./BreachClient"

export default async function BreachPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Autenticazione richiesta</div>
    }

    const incidents = await GdprRepository.getBreaches(user.id)

    return (
        <BreachClient initialIncidents={incidents} />
    )
}
