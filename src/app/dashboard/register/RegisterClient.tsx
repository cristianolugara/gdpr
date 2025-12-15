"use client"

import { useState } from "react"
import { ProcessingActivity, LegalBasis, DataCategory } from "@/types/gdpr"
import { Plus, Search, Filter, Shield, Globe, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
// Removed missing UI imports
import { createActivityAction } from "@/app/actions/gdpr"
import { useRouter } from "next/navigation"

interface RegisterClientProps {
    initialActivities: ProcessingActivity[]
}

export default function RegisterClient({ initialActivities }: RegisterClientProps) {
    const router = useRouter()
    const [activities, setActivities] = useState<ProcessingActivity[]>(initialActivities)
    const [selectedActivity, setSelectedActivity] = useState<ProcessingActivity | null>(null)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State
    const [newActivity, setNewActivity] = useState<Partial<ProcessingActivity>>({
        name: "",
        purpose: "",
        legalBasis: "CONTRACT",
        dataSubjects: [],
        dataCategories: ["COMMON"],
        dataCategoriesDetails: "",
        recipients: [],
        transfers: { isTransferred: false },
        retentionPeriod: "",
        securityMeasures: [],
        status: "ACTIVE"
    })

    const handleCreate = async () => {
        setIsSubmitting(true)
        const result = await createActivityAction(newActivity as any) // Type casting for simplicity in this MVP
        if (result.success) {
            setIsAddOpen(false)
            // Ideally we should re-fetch or optimistically update, but revalidatePath handling it on next refresh/nav
            // For immediate feedback we might want to reload or update local state if we returned the created obj.
            // For now, let's just close.
            router.refresh() // simple reload to fetch new data
        } else {
            alert("Errore durante la creazione")
        }
        setIsSubmitting(false)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Registro dei Trattamenti</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Art. 30 GDPR - Gestisci le attività di trattamento dati della tua organizzazione.
                    </p>
                </div>
                <Button onClick={() => setIsAddOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuova Attività
                </Button>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        placeholder="Cerca attività..."
                        className="w-full rounded-md border border-slate-300 bg-transparent pl-9 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700"
                    />
                </div>
                <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtri
                </Button>
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                <div className="w-full overflow-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Attività</th>
                                <th className="px-6 py-4">Base Giuridica</th>
                                <th className="px-6 py-4">Categorie Dati</th>
                                <th className="px-6 py-4">Trasferimenti</th>
                                <th className="px-6 py-4">Conservazione</th>
                                <th className="px-6 py-4">Stato</th>
                                <th className="px-6 py-4">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {activities.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                        Nessuna attività registrata. Clicca su "Nuova Attività" per iniziare.
                                    </td>
                                </tr>
                            ) : (
                                activities.map((activity) => (
                                    <tr key={activity.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 dark:text-slate-100">{activity.name}</span>
                                                <span className="text-xs text-slate-500">{activity.purpose}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                {activity.legalBasis?.replace('_', ' ') || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            <div className="flex flex-col gap-1">
                                                {activity.dataCategories && activity.dataCategories.map(c => (
                                                    <span key={c} className={`text-xs font-bold ${c === 'PARTICULAR' ? 'text-red-500' : 'text-slate-500'}`}>
                                                        {c}
                                                    </span>
                                                ))}
                                                <span className="text-xs text-slate-400 truncate max-w-[150px]" title={activity.dataCategoriesDetails}>
                                                    {activity.dataCategoriesDetails}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {activity.transfers?.isTransferred ? (
                                                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-500">
                                                    <Globe className="h-3 w-3" />
                                                    <span className="text-xs font-medium">{activity.transfers.countries?.join(', ')}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-slate-400">
                                                    <Shield className="h-3 w-3" />
                                                    <span className="text-xs">UE Only</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-3 w-3 text-slate-400" />
                                                <span className="text-xs">{activity.retentionPeriod}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${activity.status === 'ACTIVE'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                }`}>
                                                {activity.status === 'ACTIVE' && <CheckCircle className="h-3 w-3" />}
                                                {activity.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            <Button variant="ghost" size="sm" onClick={() => setSelectedActivity(activity)}>
                                                Dettagli
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CREATE DIALOG (Custom Modal) */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setIsAddOpen(false)}>
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900 border dark:border-slate-800" onClick={e => e.stopPropagation()}>
                        <div className="mb-6">
                            <h3 className="text-xl font-bold">Nuova Attività di Trattamento</h3>
                            <p className="text-slate-500 text-sm">Registra una nuova attività nel registro ex Art. 30 GDPR.</p>
                        </div>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label htmlFor="name" className="text-sm font-medium">Nome Attività</label>
                                <input
                                    id="name"
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:placeholder:text-slate-400"
                                    value={newActivity.name}
                                    onChange={e => setNewActivity({ ...newActivity, name: e.target.value })}
                                    placeholder="es. Gestione Clienti CRM"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="purpose" className="text-sm font-medium">Finalità del Trattamento</label>
                                <textarea
                                    id="purpose"
                                    className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
                                    value={newActivity.purpose}
                                    onChange={e => setNewActivity({ ...newActivity, purpose: e.target.value })}
                                    placeholder="Perché trattiamo questi dati?"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label htmlFor="legal-basis" className="text-sm font-medium">Base Giuridica</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
                                        value={newActivity.legalBasis}
                                        onChange={(e: any) => setNewActivity({ ...newActivity, legalBasis: e.target.value })}
                                    >
                                        <option value="CONSENT">Consenso</option>
                                        <option value="CONTRACT">Contratto</option>
                                        <option value="LEGAL_OBLIGATION">Obbligo Legale</option>
                                        <option value="LEGITIMATE_INTEREST">Legittimo Interesse</option>
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="retention" className="text-sm font-medium">Periodo Conservazione</label>
                                    <input
                                        id="retention"
                                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
                                        value={newActivity.retentionPeriod}
                                        onChange={e => setNewActivity({ ...newActivity, retentionPeriod: e.target.value })}
                                        placeholder="es. 10 anni"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="categories" className="text-sm font-medium">Dettaglio Categorie Dati</label>
                                <input
                                    id="categories"
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
                                    value={newActivity.dataCategoriesDetails}
                                    onChange={e => setNewActivity({ ...newActivity, dataCategoriesDetails: e.target.value })}
                                    placeholder="es. Nome, Email, Codice Fiscale"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="recipients" className="text-sm font-medium">Destinatari (separati da virgola)</label>
                                <input
                                    id="recipients"
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
                                    value={newActivity.recipients?.join(', ')}
                                    onChange={e => setNewActivity({ ...newActivity, recipients: e.target.value.split(',').map(s => s.trim()) })}
                                    placeholder="es. Commercialista, Consulente Web"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Annulla</Button>
                            <Button onClick={handleCreate} disabled={isSubmitting}>
                                {isSubmitting ? 'Salvataggio...' : 'Crea Attività'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Slide-over or Modal for Details */}
            {selectedActivity && (
                <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 backdrop-blur-sm transition-all" onClick={() => setSelectedActivity(null)}>
                    <div className="h-full w-full max-w-lg bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border-l dark:border-slate-800 overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold">{selectedActivity.name}</h3>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedActivity(null)}>Chiudi</Button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold uppercase text-slate-500 mb-2">Finalità & Base Giuridica</h4>
                                <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
                                    <p className="font-medium text-lg mb-1">{selectedActivity.purpose}</p>
                                    <p className="text-slate-500 text-sm mb-3">{selectedActivity.description}</p>
                                    <span className="inline-flex items-center rounded-md bg-white border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                                        Art. 6: {selectedActivity.legalBasis}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold uppercase text-slate-500 mb-2">Dati & Interessati</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between border-b pb-2 dark:border-slate-800">
                                        <span className="text-slate-500">Interessati</span>
                                        <span className="font-medium">{selectedActivity.dataSubjects?.join(', ') || '-'}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2 dark:border-slate-800">
                                        <span className="text-slate-500">Categorie</span>
                                        <div className="text-right">
                                            <p className="font-medium">{selectedActivity.dataCategories?.join(', ') || '-'}</p>
                                            <p className="text-xs text-slate-500">{selectedActivity.dataCategoriesDetails}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold uppercase text-slate-500 mb-2">Flussi & Destinatari</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between border-b pb-2 dark:border-slate-800">
                                        <span className="text-slate-500">Destinatari</span>
                                        <span className="font-medium text-right">{selectedActivity.recipients?.join(', ') || '-'}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2 dark:border-slate-800">
                                        <span className="text-slate-500">Trasferimenti Extra-UE</span>
                                        <div className="text-right">
                                            {selectedActivity.transfers?.isTransferred ? (
                                                <>
                                                    <p className="font-medium text-amber-600">{selectedActivity.transfers.countries?.join(', ')}</p>
                                                    <p className="text-xs text-slate-500">{selectedActivity.transfers.safeguards}</p>
                                                </>
                                            ) : (
                                                <span className="font-medium text-green-600">Nessuno</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold uppercase text-slate-500 mb-2">Sicurezza</h4>
                                <ul className="list-disc list-inside text-sm text-slate-700 dark:text-slate-300 marker:text-slate-400">
                                    {selectedActivity.securityMeasures?.map((measure, idx) => (
                                        <li key={idx}>{measure}</li>
                                    )) || <li>Nessuna misura specificata</li>}
                                </ul>
                            </div>
                        </div>

                        <div className="mt-10 flex gap-3">
                            <Button className="w-full" variant="outline">Modifica</Button>
                            <Button className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20" variant="ghost">Archivia</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
