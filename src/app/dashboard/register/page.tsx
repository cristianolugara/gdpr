import { createClient } from "@/lib/supabase/server"
import { GdprRepository } from "@/lib/repositories/gdpr"
import RegisterClient from "./RegisterClient"

export default async function RegisterPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Autenticazione richiesta</div>
    }

    const activities = await GdprRepository.getActivities(user.id)

    return (
        <RegisterClient initialActivities={activities} />
    )
}
