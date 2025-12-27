

import { getStaffList } from './actions'
import NewStaffModal from './NewStaffModal'
import StaffList from './StaffList'

export const metadata = {
    title: 'Gestione Personale | GDPR Tool',
    description: 'Gestisci dipendenti e collaboratori, lettere di nomina e NDA.',
}

export default async function StaffPage() {
    const staff = await getStaffList()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Personale & Collaboratori</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Gestisci le lettere di nomina e gli accordi di riservatezza (NDA) per il tuo team.
                    </p>
                </div>
                <NewStaffModal />
            </div>

            <StaffList initialStaff={staff} />
        </div>
    )
}
