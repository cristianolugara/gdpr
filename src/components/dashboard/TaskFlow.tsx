"use client"

import { CheckCircle2, Circle, ArrowRight, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export interface TaskStatus {
    hasProfile: boolean
    hasActivities: boolean
    hasVendors: boolean
    hasTraining: boolean
    hasRecentSecurityCheck: boolean
    hasRecentBackupCheck: boolean
}

export function TaskFlow({ status }: { status: TaskStatus }) {
    const steps = [
        {
            id: 'profile',
            title: "Configurazione Aziendale",
            description: "Completa i dati del profilo aziendale.",
            isComplete: status.hasProfile,
            href: "/dashboard/settings",
            action: "Configura"
        },
        {
            id: 'register',
            title: "Registro Trattamenti (Art. 30)",
            description: "Mappa tutti i trattamenti di dati personali.",
            isComplete: status.hasActivities,
            href: "/dashboard/register",
            action: "Compila Registro"
        },
        {
            id: 'vendors',
            title: "Registro Fornitori (Art. 28)",
            description: "Elenca i responsabili esterni e verifica le nomine.",
            isComplete: status.hasVendors,
            href: "/dashboard/vendors",
            action: "Aggiungi Fornitori"
        },
        {
            id: 'security',
            title: "Controlli di Sicurezza",
            description: "Esegui il test di sicurezza mensile.",
            isComplete: status.hasRecentSecurityCheck,
            href: "/dashboard/audits",
            action: "Esegui Test"
        },
        {
            id: 'backup',
            title: "Verifica Backup",
            description: "Conferma l'integrità dei backup (mensile).",
            isComplete: status.hasRecentBackupCheck,
            href: "/dashboard/audits",
            action: "Verifica Backup"
        },
        {
            id: 'training',
            title: "Formazione Personale",
            description: "Registra le sessioni di formazione privacy.",
            isComplete: status.hasTraining,
            href: "/dashboard/training",
            action: "Registra Formazione"
        }
    ]

    const completedSteps = steps.filter(s => s.isComplete).length
    const progress = Math.round((completedSteps / steps.length) * 100)
    const nextStep = steps.find(s => !s.isComplete)

    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900 border-l-4 border-l-blue-500">
            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        Piano di Adeguamento & Mantenimento
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                        Segui questi passaggi per garantire la conformità GDPR continua.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span>Progresso Completamento</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Next Action Card */}
                {nextStep ? (
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 mb-1">
                                    Prossimo Passo Suggerito
                                </div>
                                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                    {nextStep.title}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 mb-3">
                                    {nextStep.description}
                                </p>
                                <Link href={nextStep.href}>
                                    <Button size="sm" className="gap-2">
                                        {nextStep.action} <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="hidden sm:block">
                                <AlertCircle className="h-8 w-8 text-blue-400 opacity-50" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20 border border-green-100 dark:border-green-800 flex items-center gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                        <div>
                            <h4 className="font-semibold text-green-900 dark:text-green-100">Ottimo lavoro!</h4>
                            <p className="text-sm text-green-800 dark:text-green-200">Hai completato tutti i passaggi principali. Ricordati di mantenere aggiornati i registri mensilmente.</p>
                        </div>
                    </div>
                )}

                {/* Steps List (Collapsible or always visible?) - Let's keep it simple grid */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-2">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={`flex items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${step.isComplete
                                    ? "bg-slate-50 border-slate-200 opacity-75 dark:bg-slate-800/50 dark:border-slate-800"
                                    : "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:border-blue-300"
                                }`}
                        >
                            {step.isComplete ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                            ) : (
                                <Circle className="h-5 w-5 text-slate-300 shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className={`font-medium ${step.isComplete ? 'text-slate-500 line-through decoration-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                    {step.title}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
