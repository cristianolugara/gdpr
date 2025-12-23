'use client'

import { useState } from 'react'
import { Plus, Search, ShieldCheck, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react'
import { GdprDpia } from '@/types/gdpr'
import { createDpia } from '@/app/actions/gdpr'

export default function DpiaClient({ initialDpias }: { initialDpias: GdprDpia[] }) {
    const [dpias, setDpias] = useState<GdprDpia[]>(initialDpias)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // Form State
    const [newDpia, setNewDpia] = useState<Partial<GdprDpia>>({
        name: '',
        description: '',
        isLargeScale: false,
        isProfiling: false,
        isPublicMonitoring: false,
        isMandatory: false,
        status: 'DRAFT'
    })

    const filteredDpias = dpias.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.status.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCreate = async () => {
        if (!newDpia.name) return

        try {
            // In a real app, calculate isMandatory based on flags or user input
            // For now, simple pass-through
            const dpiaToCreate = {
                ...newDpia,
                isMandatory: newDpia.isLargeScale || newDpia.isProfiling || newDpia.isPublicMonitoring || false
            } as any

            const created = await createDpia(dpiaToCreate)
            setDpias([created, ...dpias])
            setIsCreateOpen(false)
            setNewDpia({
                name: '',
                description: '',
                isLargeScale: false,
                isProfiling: false,
                isPublicMonitoring: false,
                status: 'DRAFT'
            })
        } catch (error) {
            console.error('Failed to create DPIA', error)
            alert('Errore durante la creazione della DPIA.')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Valutazione d'Impatto (DPIA)</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Gestisci le valutazioni dei rischi per i trattamenti dati ("Data Protection Impact Assessment").
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus className="h-4 w-4" />
                    Nuova Valutazione
                </button>
            </div>

            {/* Search & Statistics */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cerca valutazioni..."
                        className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* DPIA List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredDpias.map((dpia) => (
                    <div key={dpia.id} className="group relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-3 flex items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${dpia.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400' :
                                    dpia.status === 'REVIEWED' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400' :
                                        'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                                }`}>
                                {dpia.status}
                            </span>
                        </div>

                        <h3 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">{dpia.name}</h3>
                        <p className="mb-4 text-sm text-slate-500 line-clamp-2 dark:text-slate-400">
                            {dpia.description || 'Nessuna descrizione.'}
                        </p>

                        <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className={`h-3.5 w-3.5 ${dpia.isMandatory ? 'text-red-500' : 'text-slate-300'}`} />
                                <span>Obbligatoria: {dpia.isMandatory ? 'Si (Alto Rischio)' : 'No'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText className="h-3.5 w-3.5" />
                                <span>Rischio Residuo: {dpia.residualRiskLevel || 'Non Valutato'}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t pt-3 dark:border-slate-800">
                            <span className="text-xs text-slate-400">
                                Aggiornato: {new Date(dpia.updatedAt).toLocaleDateString()}
                            </span>
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                                Gestisci
                            </button>
                        </div>
                    </div>
                ))}

                {filteredDpias.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
                        <div className="rounded-full bg-slate-50 p-3 dark:bg-slate-900">
                            <ShieldCheck className="h-6 w-6 text-slate-400" />
                        </div>
                        <h3 className="mt-3 text-sm font-semibold">Nessuna DPIA trovata</h3>
                        <p className="text-sm text-slate-500">Crea la tua prima valutazione d'impatto.</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
                        <h2 className="mb-4 text-lg font-semibold">Nuova DPIA</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Nome Trattamento / Progetto</label>
                                <input
                                    className="w-full rounded-md border border-slate-300 p-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                    value={newDpia.name}
                                    onChange={(e) => setNewDpia({ ...newDpia, name: e.target.value })}
                                    placeholder="Es. Videosorveglianza, Profilazione Clienti..."
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Descrizione</label>
                                <textarea
                                    className="w-full rounded-md border border-slate-300 p-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                                    rows={3}
                                    value={newDpia.description}
                                    onChange={(e) => setNewDpia({ ...newDpia, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Fattori di Rischio (Screening)</label>
                                <div className="space-y-2 rounded-md border p-3 dark:border-slate-700">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={newDpia.isLargeScale}
                                            onChange={(e) => setNewDpia({ ...newDpia, isLargeScale: e.target.checked })}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        Trattamento su Larga Scala
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={newDpia.isProfiling}
                                            onChange={(e) => setNewDpia({ ...newDpia, isProfiling: e.target.checked })}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        Profilazione o Scoring Utenti
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={newDpia.isPublicMonitoring}
                                            onChange={(e) => setNewDpia({ ...newDpia, isPublicMonitoring: e.target.checked })}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        Sorveglianza sistematica (CCTV)
                                    </label>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Se selezioni una di queste voci, la DPIA è quasi sicuramente <strong>OBBLIGATORIA</strong> (Art. 35 GDPR).
                                </p>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setIsCreateOpen(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    Annulla
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    Crea Valutazione
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
