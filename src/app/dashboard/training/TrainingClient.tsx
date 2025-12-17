"use client"

import { useState } from "react"
import { GdprTraining } from "@/types/gdpr"
import { Plus, Search, Calendar, Users, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createTrainingAction } from "@/app/actions/gdpr"
import { useRouter } from "next/navigation"

interface TrainingClientProps {
    initialTraining: GdprTraining[]
}

export default function TrainingClient({ initialTraining }: TrainingClientProps) {
    const router = useRouter()
    const [trainings, setTrainings] = useState<GdprTraining[]>(initialTraining)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State
    const [newTraining, setNewTraining] = useState<Partial<GdprTraining>>({
        title: "",
        description: "",
        date: new Date().toISOString().split('T')[0], // Today YYYY-MM-DD
        durationMinutes: 120, // Default 2h
        attendees: [],
    })

    const handleCreate = async () => {
        setIsSubmitting(true)
        const result = await createTrainingAction(newTraining as any)
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
                    <h2 className="text-2xl font-bold tracking-tight">Registro Formazione Privacy</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Art. 29 GDPR - Tieni traccia dei corsi e dei partecipanti.
                    </p>
                </div>
                <Button onClick={() => setIsAddOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuova Sessione
                </Button>
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                <div className="w-full overflow-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Titolo / Argomento</th>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4">Durata</th>
                                <th className="px-6 py-4">Partecipanti</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {initialTraining.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                        Nessuna sessione formativa registrata.
                                    </td>
                                </tr>
                            ) : (
                                initialTraining.map((session) => (
                                    <tr key={session.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                                            {session.title}
                                            {session.description && <div className="text-xs text-slate-500 font-normal">{session.description}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-slate-400" />
                                                {new Date(session.date).toLocaleDateString("it-IT")}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {session.durationMinutes} min
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                                <Users className="h-4 w-4 text-slate-400" />
                                                <span>{session.attendees?.length || 0} Partecipanti</span>
                                            </div>
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
                            <h3 className="text-xl font-bold">Nuova Sessione Formativa</h3>
                            <p className="text-slate-500 text-sm">Registra una sessione di formazione privacy.</p>
                        </div>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Titolo Corso</label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                                    value={newTraining.title}
                                    onChange={e => setNewTraining({ ...newTraining, title: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Descrizione / Argomenti</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                                    value={newTraining.description}
                                    onChange={e => setNewTraining({ ...newTraining, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Data</label>
                                    <input
                                        type="date"
                                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                                        value={newTraining.date ? new Date(newTraining.date).toISOString().split('T')[0] : ''}
                                        onChange={e => setNewTraining({ ...newTraining, date: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Durata (min)</label>
                                    <input
                                        type="number"
                                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                                        value={newTraining.durationMinutes}
                                        onChange={e => setNewTraining({ ...newTraining, durationMinutes: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Partecipanti (separati da virgola)</label>
                                <textarea
                                    className="flex min-h-[60px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                                    value={newTraining.attendees?.join(', ')}
                                    onChange={e => setNewTraining({ ...newTraining, attendees: e.target.value.split(',').map(s => s.trim()) })}
                                    placeholder="Mario Rossi, Luigi Bianchi..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Annulla</Button>
                            <Button onClick={handleCreate} disabled={isSubmitting}>
                                {isSubmitting ? 'Salvataggio...' : 'Salva Sessione'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
