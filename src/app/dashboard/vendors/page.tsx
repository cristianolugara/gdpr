import { createClient } from "@/lib/supabase/server"
import { GdprRepository } from "@/lib/repositories/gdpr"
import VendorsClient from "./VendorsClient"

export default async function VendorsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Autenticazione richiesta</div>
    }

    const vendors = await GdprRepository.getVendors(user.id)

    return (
        <VendorsClient initialVendors={vendors} />
    )
}
