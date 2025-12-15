"use client"

import { useState, useEffect } from "react"
import { DataBreachIncident, DataBreachSeverity } from "@/types/gdpr"
import { DATA_BREACH_CHECKLIST } from "@/lib/data/gdpr-templates"
import { Button } from "@/components/ui/button"
import {
    ShieldAlert,
    AlertTriangle,
    CheckCircle,
    Clock,
    FileText,
    ChevronRight,
    Siren
} from "lucide-react"

// Mock Data
const MOCK_INCIDENTS: DataBreachIncident[] = [
    {
        id: "INC-2024-001",
        companyId: "COMP-123",
        detectionDate: "2024-12-14T15:00:00", // Yesterday
        notificationDeadline: "2024-12-17T15:00:00", // +72h
        description: "Rilevato accesso non autorizzato al server di posta elettronica di un dipendente.",
        affectedDataCategories: ["Email", "Nominativi", "Contratti"],
        affectedSubjectsCount: 50,
        confidentialityCompromised: true,
        integrityCompromised: false,
        availabilityCompromised: false,
        riskAssessments: {
            rightsAndFreedoms: 'HIGH',
            justification: "Possibile furto di identità per i clienti coinvolti nelle email."
        },
        actionsTaken: ["Reset password account compromesso", "Analisi logs server"],
        isGaranteNotified: false,
        isSubjectsNotified: false,
        status: 'INVESTIGATING',
        createdAt: "2024-12-14T15:30:00",
        updatedAt: "2024-12-14T16:00:00"
    }
]

export default function BreachPage() {
    const [incidents, setIncidents] = useState<DataBreachIncident[]>(MOCK_INCIDENTS)
    const [selectedIncident, setSelectedIncident] = useState<DataBreachIncident | null>(MOCK_INCIDENTS[0] || null)

    const [timeLeft, setTimeLeft] = useState<string>("")

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
                    <Button variant="destructive" className="gap-2">
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
                                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono dark:bg-slate-800">{incident.id}</span>
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
        </div>
    )
}
