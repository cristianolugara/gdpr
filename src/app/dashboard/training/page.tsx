import { createClient } from "@/lib/supabase/server"
import { GdprRepository } from "@/lib/repositories/gdpr"
import TrainingClient from "./TrainingClient"

export default async function TrainingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Autenticazione richiesta</div>
    }

    const training = await GdprRepository.getTraining(user.id)

    return (
        <TrainingClient initialTraining={training} />
    )
}
