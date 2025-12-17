"use client"

import { useState } from "react"
import { GdprAuditLog } from "@/types/gdpr"
import { Plus, CheckCircle, XCircle, AlertTriangle, Calendar, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createAuditAction } from "@/app/actions/gdpr"
import { useRouter } from "next/navigation"

interface AuditsClientProps {
    initialLogs: GdprAuditLog[]
}

export default function AuditsClient({ initialLogs }: AuditsClientProps) {
    const router = useRouter()
    const [logs, setLogs] = useState<GdprAuditLog[]>(initialLogs)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State
    const [newLog, setNewLog] = useState<Partial<GdprAuditLog>>({
        type: "SECURITY_CHECK",
        status: "PASS",
        date: new Date().toISOString().split('T')[0],
        performedBy: "",
        notes: ""
    })

    const handleCreate = async () => {
        setIsSubmitting(true)
        const result = await createAuditAction(newLog as any)
        if (result.success) {
            setIsAddOpen(false)
            router.refresh()
        } else {
            alert("Errore durante la creazione")
        }
        setIsSubmitting(false)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Registro dei Controlli</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Monitoraggio periodico di sicurezza, backup e audit annuali.
                    </p>
                </div>
                <Button onClick={() => setIsAddOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuovo Controllo
                </Button>
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                <div className="w-full overflow-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Tipo Test</th>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4">Esito</th>
                                <th className="px-6 py-4">Eseguito da</th>
                                <th className="px-6 py-4">Note</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {initialLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        Nessun audit registrato.
                                    </td>
                                </tr>
                            ) : (
                                initialLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                                            {log.type === 'SECURITY_CHECK' ? 'Test Sicurezza Mensile' :
                                                log.type === 'BACKUP_CHECK' ? 'Verifica Backup Mensile' :
                                                    log.type === 'ANNUAL_AUDIT' ? 'Piano Mantenimento Annuale' :
                                                        'Verifica DPO'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-slate-400" />
                                                {new Date(log.date).toLocaleDateString("it-IT")}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${log.status === 'PASS' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                                    log.status === 'WARNING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                                }`}>
                                                {log.status === 'PASS' ? <CheckCircle className="h-3 w-3" /> :
                                                    log.status === 'WARNING' ? <AlertTriangle className="h-3 w-3" /> :
                                                        <XCircle className="h-3 w-3" />}
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {log.performedBy || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={log.notes}>
                                            {log.notes || '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CREATE DIALOG */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setIsAddOpen(false)}>
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900 border dark:border-slate-800" onClick={e => e.stopPropagation()}>
                        <div className="mb-6">
                            <h3 className="text-xl font-bold">Nuovo Report di Controllo</h3>
                            <p className="text-slate-500 text-sm">Registra l'esito di un controllo periodico.</p>
                        </div>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Tipo Controllo</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                                    value={newLog.type}
                                    onChange={(e: any) => setNewLog({ ...newLog, type: e.target.value })}
                                >
                                    <option value="SECURITY_CHECK">Test Sicurezza (Mensile)</option>
                                    <option value="BACKUP_CHECK">Verifica Backup (Mensile)</option>
                                    <option value="ANNUAL_AUDIT">Piano Mantenimento (Annuale)</option>
                                    <option value="DPO_CHECK">Verifica DPO</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Data Esecuzione</label>
                                    <input
                                        type="date"
                                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                                        value={newLog.date ? new Date(newLog.date).toISOString().split('T')[0] : ''}
                                        onChange={e => setNewLog({ ...newLog, date: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Esito</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                                        value={newLog.status}
                                        onChange={(e: any) => setNewLog({ ...newLog, status: e.target.value })}
                                    >
                                        <option value="PASS">Superato (PASS)</option>
                                        <option value="WARNING">Con Riserva (WARNING)</option>
                                        <option value="FAIL">Fallito (FAIL)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Eseguito da</label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                                    value={newLog.performedBy}
                                    onChange={e => setNewLog({ ...newLog, performedBy: e.target.value })}
                                    placeholder="Nome tecnico o responsabile"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Note / Risultati</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                                    value={newLog.notes}
                                    onChange={e => setNewLog({ ...newLog, notes: e.target.value })}
                                    placeholder="Dettagli sull'esito del test..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Annulla</Button>
                            <Button onClick={handleCreate} disabled={isSubmitting}>
                                {isSubmitting ? 'Salvataggio...' : 'Salva Report'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
