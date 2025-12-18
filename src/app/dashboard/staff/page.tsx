
import { getStaffList, deleteStaffMember } from './actions'
import NewStaffModal from './NewStaffModal'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, FileText, User } from 'lucide-react'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'

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

            <div className="rounded-md border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800 border-slate-200 dark:border-slate-800">
                                <th className="h-12 px-4 align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                                    Nome
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                                    Ruolo
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400">
                                    Tipologia
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400 text-center">
                                    Nomina
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400 text-center">
                                    NDA
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400 text-right">
                                    Azioni
                                </th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {staff.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="h-24 text-center">
                                        Nessun membro del personale trovato.
                                    </td>
                                </tr>
                            ) : (
                                staff.map((member) => (
                                    <tr
                                        key={member.id}
                                        className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800 border-slate-200 dark:border-slate-800"
                                    >
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{member.first_name} {member.last_name}</span>
                                                <span className="text-xs text-slate-500">{member.email || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            {member.role || '-'}
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            <Badge variant={member.employment_type === 'INTERNAL' ? 'default' : 'secondary'} className="text-xs">
                                                {member.employment_type === 'INTERNAL' && 'Dipendente'}
                                                {member.employment_type === 'EXTERNAL' && 'Esterno'}
                                                {member.employment_type === 'AUTONOMOUS' && 'Autonomo'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-center">
                                            <div className="flex justify-center">
                                                {member.has_signed_appointment ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-red-300" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-center">
                                            <div className="flex justify-center">
                                                {member.has_signed_nda ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-red-300" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                                            {/* Actions placeholder - for now plain text or simple buttons if needed */}
                                            <span className="text-xs text-slate-400">Modifica</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
