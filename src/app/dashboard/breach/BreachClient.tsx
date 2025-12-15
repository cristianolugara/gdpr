"use client"

import { useState, useEffect } from "react"
import { DataBreachIncident } from "@/types/gdpr"
import { DATA_BREACH_CHECKLIST } from "@/lib/data/gdpr-templates"
import { Button } from "@/components/ui/button"
// Removed missing UI imports
import { createBreachAction } from "@/app/actions/gdpr"
import { useRouter } from "next/navigation"
import {
    ShieldAlert,
    AlertTriangle,
    Clock,
    Siren
} from "lucide-react"

interface BreachClientProps {
    initialIncidents: DataBreachIncident[]
}

export default function BreachClient({ initialIncidents }: BreachClientProps) {
    const router = useRouter()
    const [incidents, setIncidents] = useState<DataBreachIncident[]>(initialIncidents)
    const [selectedIncident, setSelectedIncident] = useState<DataBreachIncident | null>(initialIncidents[0] || null)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [timeLeft, setTimeLeft] = useState<string>("")

    // Form State
    const [newBreach, setNewBreach] = useState<Partial<DataBreachIncident>>({
        detectionDate: new Date().toISOString().slice(0, 16), // datetime-local format
        description: "",
        affectedDataCategories: [],
        affectedSubjectsCount: 0,
        confidentialityCompromised: false,
        integrityCompromised: false,
        availabilityCompromised: false,
        riskAssessments: { rightsAndFreedoms: 'LOW', justification: '' },
        actionsTaken: [],
        status: 'investigating' as any, // initial status usually
        isGaranteNotified: false,
        isSubjectsNotified: false
    })

    const [catInput, setCatInput] = useState("")

    useEffect(() => {
        if (!selectedIncident) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const deadline = new Date(selectedIncident.notificationDeadline).getTime();
            const distance = deadline - now;

            if (distance < 0) {
                setTimeLeft("SCADUTO");
            } else {
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${hours}h ${minutes}m`);
            }
        }, 60000); // Update every minute to save resources in this mock

        // Initial calc
        const now = new Date().getTime();
        const deadline = new Date(selectedIncident.notificationDeadline).getTime();
        const distance = deadline - now;
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);

        return () => clearInterval(timer);
    }, [selectedIncident]);

    const handleCreate = async () => {
        setIsSubmitting(true)
        // Calc deadline +72h from detection
        const detection = new Date(newBreach.detectionDate!)
        const deadline = new Date(detection.getTime() + (72 * 60 * 60 * 1000))

        const payload = {
            ...newBreach,
            detectionDate: detection.toISOString(),
            notificationDeadline: deadline.toISOString(),
            affectedDataCategories: catInput.split(',').map(s => s.trim()).filter(s => s),
            status: 'INVESTIGATING'
        }

        const result = await createBreachAction(payload as any)
        if (result.success) {
            setIsAddOpen(false)
            router.refresh()
        } else {
            alert("Errore segnalazione violazione")
        }
        setIsSubmitting(false)
    }


    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-red-600 dark:text-red-500">
                        <Siren className="h-8 w-8 animate-pulse" />
                        Gestione Data Breach
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Protocollo di risposta alle violazioni dei dati (Art. 33-34 GDPR)
                    </p>
                </div>
                <div>
                    <Button variant="destructive" className="gap-2" onClick={() => setIsAddOpen(true)}>
                        <AlertTriangle className="h-4 w-4" />
                        SEGNALA NUOVA VIOLAZIONE
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* List of Incidents */}
                <div className="space-y-4 lg:col-span-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Violazioni Attive</h3>
                    {incidents.map(incident => (
                        <div
                            key={incident.id}
                            onClick={() => setSelectedIncident(incident)}
                            className={`cursor-pointer rounded-lg border p-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 ${selectedIncident?.id === incident.id ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/10' : 'bg-white dark:bg-slate-900 dark:border-slate-800'}`}
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono dark:bg-slate-800 max-w-[100px] truncate">{incident.id}</span>
                                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${incident.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {incident.status}
                                </span>
                            </div>
                            <h4 className="font-medium line-clamp-1">{incident.description}</h4>
                            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                <Clock className="h-3 w-3" />
                                <span>Rilevato il: {new Date(incident.detectionDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                    {incidents.length === 0 && (
                        <div className="rounded-lg border border-dashed p-8 text-center text-slate-500">
                            Nessuna violazione attiva.
                        </div>
                    )}
                </div>

                {/* Main Action Area */}
                <div className="lg:col-span-2">
                    {selectedIncident ? (
                        <div className="rounded-xl border bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
                            {/* Header Breach Detail */}
                            <div className="flex flex-col gap-4 border-b p-6 md:flex-row md:items-center md:justify-between dark:border-slate-800">
                                <div>
                                    <h3 className="text-xl font-bold">Protocollo di Emergenza</h3>
                                    <p className="text-sm text-slate-500">Violazione ID: {selectedIncident.id}</p>
                                </div>
                                <div className="flex items-center gap-4 rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                    <div className="text-center">
                                        <p className="text-xs font-bold uppercase opacity-70">Tempo Rimante (72h)</p>
                                        <p className="text-2xl font-mono font-bold tracking-wider">{timeLeft}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Checklist Workflow */}
                            <div className="p-6">
                                <div className="mb-6 rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                                    <h4 className="mb-2 font-semibold flex items-center gap-2">
                                        <ShieldAlert className="h-4 w-4" />
                                        Dettagli Incidente
                                    </h4>
                                    <p className="mb-4 text-sm">{selectedIncident.description}</p>

                                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                        <div className={`rounded p-2 ${selectedIncident.confidentialityCompromised ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 'bg-slate-100 text-slate-400'}`}>
                                            Riservatezza
                                        </div>
                                        <div className={`rounded p-2 ${selectedIncident.integrityCompromised ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 'bg-slate-100 text-slate-400'}`}>
                                            Integrità
                                        </div>
                                        <div className={`rounded p-2 ${selectedIncident.availabilityCompromised ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 'bg-slate-100 text-slate-400'}`}>
                                            Disponibilità
                                        </div>
                                    </div>
                                </div>

                                <h4 className="mb-4 text-lg font-bold">Checklist Azioni (Obbligatorie)</h4>
                                <div className="space-y-4">
                                    {DATA_BREACH_CHECKLIST.map((step, index) => (
                                        <div key={step.id} className="flex items-start gap-4">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-slate-200 bg-white font-bold text-slate-400 dark:border-slate-700 dark:bg-slate-800">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 rounded-lg border p-4 transition-all hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-600">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="font-semibold">{step.step.replace(/^\d+\.\s/, '')}</h5>
                                                    <Button size="sm" variant="outline" className="h-8">
                                                        Segna come Fatto
                                                    </Button>
                                                </div>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 flex justify-end gap-3 border-t pt-6 dark:border-slate-800">
                                    <Button variant="secondary">Genera Report Interno</Button>
                                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                                        Procedi a Notifica Garante (72h)
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl border bg-slate-50 text-slate-400 dark:bg-slate-900 dark:border-slate-800">
                            <ShieldAlert className="h-12 w-12 opacity-50" />
                            <p>Seleziona una violazione per gestire il protocollo.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* CREATE DIALOG (Custom Modal) */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setIsAddOpen(false)}>
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900 border dark:border-slate-800" onClick={e => e.stopPropagation()}>
                        <div className="mb-6">
                            <h3 className="text-xl font-bold">Segnala Data Breach</h3>
                            <p className="text-slate-500 text-sm">Compila il modulo per attivare il protocollo di risposta e notifica.</p>
                        </div>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label htmlFor="detection" className="text-sm font-medium">Data/Ora Rilevamento</label>
                                <input
                                    id="detection"
                                    type="datetime-local"
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
                                    value={newBreach.detectionDate}
                                    onChange={e => setNewBreach({ ...newBreach, detectionDate: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="desc" className="text-sm font-medium">Descrizione Incidente</label>
                                <textarea
                                    id="desc"
                                    className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
                                    value={newBreach.description}
                                    onChange={e => setNewBreach({ ...newBreach, description: e.target.value })}
                                    placeholder="Cosa è successo?"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="cats" className="text-sm font-medium">Categorie Dati Coinvolte (CSV)</label>
                                <input
                                    id="cats"
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
                                    value={catInput}
                                    onChange={e => setCatInput(e.target.value)}
                                    placeholder="Email, Password, Dati Finanziari..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Tipologia Violazione</label>
                                <div className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="conf"
                                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400"
                                            checked={newBreach.confidentialityCompromised}
                                            onChange={(e) => setNewBreach({ ...newBreach, confidentialityCompromised: e.target.checked })}
                                        />
                                        <label htmlFor="conf" className="text-sm">Riservatezza</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="int"
                                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400"
                                            checked={newBreach.integrityCompromised}
                                            onChange={(e) => setNewBreach({ ...newBreach, integrityCompromised: e.target.checked })}
                                        />
                                        <label htmlFor="int" className="text-sm">Integrità</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="avail"
                                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400"
                                            checked={newBreach.availabilityCompromised}
                                            onChange={(e) => setNewBreach({ ...newBreach, availabilityCompromised: e.target.checked })}
                                        />
                                        <label htmlFor="avail" className="text-sm">Disponibilità</label>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label htmlFor="affected" className="text-sm font-medium">N. Interessati (Stima)</label>
                                    <input
                                        id="affected"
                                        type="number"
                                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
                                        value={newBreach.affectedSubjectsCount}
                                        onChange={e => setNewBreach({ ...newBreach, affectedSubjectsCount: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Annulla</Button>
                            <Button variant="destructive" onClick={handleCreate} disabled={isSubmitting}>
                                {isSubmitting ? 'Segnalazione...' : 'Segnala Violazione'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
