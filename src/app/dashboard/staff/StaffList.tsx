"use client"

import { StaffMember } from '@/types/staff'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { generateAppointmentLetter } from '@/lib/services/pdfGenerator'

interface StaffListProps {
    initialStaff: StaffMember[]
}

export default function StaffList({ initialStaff }: StaffListProps) {

    const downloadAppointmentLetter = (member: StaffMember) => {
        // In a real app, company name would come from settings context or DB
        const companyName = "Azienda Titolare S.r.l."
        const doc = generateAppointmentLetter(member, companyName)
        doc.save(`Nomina_Incaricato_${member.last_name}_${member.first_name}.pdf`)
    }

    return (
        <div className="rounded-md border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm text-left">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/50 border-slate-200 dark:border-slate-800">
                            <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400">Nome</th>
                            <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400">Ruolo</th>
                            <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400">Tipologia</th>
                            <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400 text-center">Nomina</th>
                            <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400 text-center">NDA</th>
                            <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {initialStaff.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="h-24 text-center">Nessun membro del personale trovato.</td>
                            </tr>
                        ) : (
                            initialStaff.map((member) => (
                                <tr key={member.id} className="border-b transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/50 border-slate-200 dark:border-slate-800">
                                    <td className="p-4 align-middle">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{member.first_name} {member.last_name}</span>
                                            <span className="text-xs text-slate-500">{member.email || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">{member.role || '-'}</td>
                                    <td className="p-4 align-middle">
                                        <Badge variant={member.employment_type === 'INTERNAL' ? 'default' : 'secondary'} className="text-xs">
                                            {member.employment_type === 'INTERNAL' && 'Dipendente'}
                                            {member.employment_type === 'EXTERNAL' && 'Esterno'}
                                            {member.employment_type === 'AUTONOMOUS' && 'Autonomo'}
                                        </Badge>
                                        {member.is_system_admin && (
                                            <Badge variant="outline" className="text-[10px] ml-1 border-purple-200 text-purple-700 bg-purple-50">Admin Sys</Badge>
                                        )}
                                        {member.is_privacy_ref && (
                                            <Badge variant="outline" className="text-[10px] ml-1 border-blue-200 text-blue-700 bg-blue-50">Ref. Privacy</Badge>
                                        )}
                                    </td>
                                    <td className="p-4 align-middle text-center">
                                        <div className="flex justify-center">
                                            {member.has_signed_appointment ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-300" />}
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle text-center">
                                        <div className="flex justify-center">
                                            {member.has_signed_nda ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-300" />}
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                onClick={() => downloadAppointmentLetter(member)}
                                            >
                                                <FileDown className="mr-1 h-3 w-3" />
                                                Incarico
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500">
                                                Modifica
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
