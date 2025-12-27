"use client"

import { useState } from "react"
import { GdprAuditLog } from "@/types/gdpr"
import { Plus, CheckCircle, XCircle, AlertTriangle, Calendar, FileText, Play, ArrowRight, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createAuditAction } from "@/app/actions/gdpr"
import { useRouter } from "next/navigation"
import { WEBSITE_AUDIT_QUESTIONS, GENERAL_AUDIT_QUESTIONS, AuditQuestion } from "@/lib/data/audit-checklists"

interface AuditsClientProps {
    initialLogs: GdprAuditLog[]
}

export default function AuditsClient({ initialLogs }: AuditsClientProps) {
    const router = useRouter()
    const [logs, setLogs] = useState<GdprAuditLog[]>(initialLogs)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Wizard State
    const [isWizardOpen, setIsWizardOpen] = useState(false)
    const [wizardType, setWizardType] = useState<'WEBSITE' | 'GENERAL'>('WEBSITE')
    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<Record<string, boolean>>({}) // id -> yes/no
    const [wizardScore, setWizardScore] = useState<number | null>(null)

    // Manual Log Form State
    const [newLog, setNewLog] = useState<Partial<GdprAuditLog>>({
        type: "SECURITY_CHECK",
        status: "PASS",
        date: new Date().toISOString().split('T')[0],
        performedBy: "",
        notes: ""
    })

    const handleCreateManual = async () => {
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

    // WIZARD LOGIC
    const startWizard = (type: 'WEBSITE' | 'GENERAL') => {
        setWizardType(type)
        setCurrentStep(0)
        setAnswers({})
        setWizardScore(null)
        setIsWizardOpen(true)
    }

    const currentQuestions = wizardType === 'WEBSITE' ? WEBSITE_AUDIT_QUESTIONS : GENERAL_AUDIT_QUESTIONS

    const handleAnswer = (answer: boolean) => {
        const questionId = currentQuestions[currentStep].id
        const newAnswers = { ...answers, [questionId]: answer }
        setAnswers(newAnswers)

        if (currentStep < currentQuestions.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            // Finish
            calculateScore(newAnswers)
        }
    }

    const calculateScore = async (finalAnswers: Record<string, boolean>) => {
        let totalWeight = 0
        let obtainedWeight = 0
        const notesLines: string[] = []

        currentQuestions.forEach(q => {
            totalWeight += q.weight
            if (finalAnswers[q.id]) {
                obtainedWeight += q.weight
            } else {
                notesLines.push(`[FAIL] ${q.question} -> ${q.remediationAction}`)
            }
        })

        const score = Math.round((obtainedWeight / totalWeight) * 100)
        setWizardScore(score)

        // Auto-save the log
        const auditType = wizardType === 'WEBSITE' ? 'SECURITY_CHECK' : 'ANNUAL_AUDIT' // Mapping roughly
        const status = score === 100 ? 'PASS' : score > 60 ? 'WARNING' : 'FAIL'
        const notes = `Audit Guidato ${wizardType} - Score: ${score}/100.\n` + notesLines.join('\n')

        await createAuditAction({
            type: auditType,
            status,
            date: new Date().toISOString(),
            performedBy: 'Audit Wizard',
            notes
        } as any)

        router.refresh()
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
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => startWizard('WEBSITE')} className="hidden sm:flex">
                        <Play className="mr-2 h-4 w-4" /> Audit Sito
                    </Button>
                    <Button onClick={() => setIsAddOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuovo Controllo
                    </Button>
                </div>
            </div>

            {/* QUICK ACTIONS CARDS FOR MOBILE/DESKTOP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div className="rounded-xl border bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm dark:from-slate-900 dark:to-slate-900 cursor-pointer hover:border-orange-300 transition-all group" onClick={() => startWizard('WEBSITE')}>
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-bold text-lg text-orange-900 dark:text-orange-100">Audit Sito Web</h3>
                            <p className="text-sm text-orange-700/70 dark:text-orange-200/50 mt-1">Verifica Cookie, Privacy Policy e Form in 2 min.</p>
                        </div>
                        <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform dark:bg-slate-800">
                            <Play className="h-5 w-5 text-orange-600" />
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm dark:from-slate-900 dark:to-slate-900 cursor-pointer hover:border-blue-300 transition-all group" onClick={() => startWizard('GENERAL')}>
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100">Audit Generale GDPR</h3>
                            <p className="text-sm text-blue-700/70 dark:text-blue-200/50 mt-1">Checklist completa per Titolari del Trattamento.</p>
                        </div>
                        <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform dark:bg-slate-800">
                            <Play className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                </div>
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
                                            {log.type === 'SECURITY_CHECK' ? 'Test Sicurezza' :
                                                log.type === 'BACKUP_CHECK' ? 'Backup Check' :
                                                    log.type === 'ANNUAL_AUDIT' ? 'Audit Annuale' :
                                                        'DPO Check'}
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

            {/* MANUAL CREATE DIALOG */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setIsAddOpen(false)}>
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900 border dark:border-slate-800" onClick={e => e.stopPropagation()}>
                        <div className="mb-6">
                            <h3 className="text-xl font-bold">Nuovo Report di Controllo (Manuale)</h3>
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
                            {/* ... (rest of manual form same as before but simplified for brevity of edit) ... */}
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
                                <label className="text-sm font-medium">Note</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                                    value={newLog.notes}
                                    onChange={e => setNewLog({ ...newLog, notes: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Annulla</Button>
                            <Button onClick={handleCreateManual} disabled={isSubmitting}>Salva</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* WIZARD DIALOG */}
            {isWizardOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in zoom-in-95" onClick={() => setIsWizardOpen(false)}>
                    <div className="w-full max-w-xl rounded-2xl bg-white p-0 shadow-2xl dark:bg-slate-900 border dark:border-slate-800 overflow-hidden text-left" onClick={e => e.stopPropagation()}>
                        {wizardScore === null ? (
                            <>
                                <div className="p-6 border-b bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                            {wizardType === 'WEBSITE' ? 'Audit Sito Web' : 'Audit Generale'}
                                        </h3>
                                        <p className="text-slate-500 text-sm">Domanda {currentStep + 1} di {currentQuestions.length}</p>
                                    </div>
                                    <button onClick={() => setIsWizardOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                                </div>
                                <div className="p-8">
                                    <div className="mb-2">
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase ${currentQuestions[currentStep].category === 'WEBSITE' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {currentQuestions[currentStep].category}
                                        </span>
                                    </div>
                                    <h4 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white leading-tight">
                                        {currentQuestions[currentStep].question}
                                    </h4>
                                    <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">
                                        {currentQuestions[currentStep].description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => handleAnswer(false)}
                                            className="flex flex-col items-center justify-center p-6 border-2 border-slate-100 rounded-xl hover:border-red-200 hover:bg-red-50 text-slate-600 hover:text-red-700 transition-all gap-2"
                                        >
                                            <XCircle className="h-8 w-8" />
                                            <span className="font-bold text-lg">No / Non so</span>
                                        </button>
                                        <button
                                            onClick={() => handleAnswer(true)}
                                            className="flex flex-col items-center justify-center p-6 border-2 border-slate-100 rounded-xl hover:border-green-200 hover:bg-green-50 text-slate-600 hover:text-green-700 transition-all gap-2"
                                        >
                                            <CheckCircle className="h-8 w-8" />
                                            <span className="font-bold text-lg">Sì, presente</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t flex justify-center">
                                    <div className="flex gap-1">
                                        {currentQuestions.map((_, idx) => (
                                            <div key={idx} className={`h-1.5 w-8 rounded-full transition-colors ${idx === currentStep ? 'bg-blue-600' : idx < currentStep ? 'bg-blue-200' : 'bg-slate-200'}`} />
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            // SCORE RESULT VIEW
                            <div className="text-center p-8 py-12">
                                <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 mb-6
                                    ${wizardScore >= 80 ? 'border-green-500 bg-green-50 text-green-600' :
                                        wizardScore >= 50 ? 'border-yellow-500 bg-yellow-50 text-yellow-600' :
                                            'border-red-500 bg-red-50 text-red-600'}`}>
                                    <span className="text-3xl font-bold">{wizardScore}%</span>
                                </div>

                                <h3 className="text-2xl font-bold mb-2">
                                    {wizardScore >= 80 ? 'Ottimo lavoro!' : wizardScore >= 50 ? 'Ci sono margini di miglioramento' : 'Attenzione richiesta'}
                                </h3>

                                <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                                    Il risultato del test è stato salvato automaticamente nel registro degli audit.
                                    {wizardScore < 100 && " Controlla le note del report per le azioni correttive personalizzate."}
                                </p>

                                <Button size="lg" onClick={() => setIsWizardOpen(false)}>
                                    Chiudi e vai al Registro
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
