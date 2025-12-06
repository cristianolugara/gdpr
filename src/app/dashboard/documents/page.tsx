'use client'

import { useState } from 'react'
import { Bot, FileText, Check, Loader2, AlertCircle } from 'lucide-react'

export default function DocumentsPage() {
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        companyName: '',
        websiteUrl: '',
        docType: 'Privacy Policy',
        dataTypes: [] as string[]
    })
    const [generatedDoc, setGeneratedDoc] = useState('')

    const docOptions = [
        "Privacy Policy",
        "Cookie Policy",
        "Registro dei Trattamenti",
        "Nomina Responsabile (DPA)",
        "Valutazione Rischi (DPIA)"
    ]

    const dataOptions = [
        "Indirizzo Email",
        "Nome e Cognome",
        "Numero di Telefono",
        "Indirizzo/Posizione",
        "Indirizzo IP",
        "Cookie di Profilazione",
        "Dati di Pagamento",
        "Dati di Utilizzo"
    ]

    const handleCheckboxChange = (option: string) => {
        setFormData(prev => {
            if (prev.dataTypes.includes(option)) {
                return { ...prev, dataTypes: prev.dataTypes.filter(t => t !== option) }
            } else {
                return { ...prev, dataTypes: [...prev.dataTypes, option] }
            }
        })
    }

    const handleGenerate = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error('Errore nella generazione del documento')
            }

            const data = await response.json()
            setGeneratedDoc(data.content)
            setStep(2)
        } catch (err) {
            setError('Si è verificato un errore durante la generazione. Riprova.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Generatore Documenti AI</h2>
                <p className="text-slate-500 dark:text-slate-400">
                    Crea documenti legali personalizzati utilizzando la nostra intelligenza artificiale avanzata (GPT-4o).
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">

                {/* Input Form */}
                <div className="space-y-6">
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900">
                        <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            Configurazione Documento
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium">Tipo di Documento</label>
                                <select
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                    value={formData.docType}
                                    onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                                >
                                    {docOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Nome Azienda / Titolare</label>
                                <input
                                    type="text"
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                    placeholder="Es. Mario Rossi SRL"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Sito Web (URL)</label>
                                <input
                                    type="text"
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                    placeholder="https://mysite.com"
                                    value={formData.websiteUrl}
                                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Dati Trattati</label>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {dataOptions.map((option) => (
                                        <label key={option} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors dark:hover:bg-slate-800">
                                            <input
                                                type="checkbox"
                                                checked={formData.dataTypes.includes(option)}
                                                onChange={() => handleCheckboxChange(option)}
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <div className="mt-6">
                            <button
                                onClick={handleGenerate}
                                disabled={loading || !formData.companyName}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg disabled:shadow-none"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Generazione in corso...
                                    </>
                                ) : (
                                    <>
                                        <Bot className="h-5 w-5" />
                                        Genera con AI
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Output Area */}
                <div className="space-y-6">
                    <div className="h-full rounded-xl border bg-slate-50 p-6 shadow-md dark:bg-slate-950/50 min-h-[600px] flex flex-col relative overflow-hidden">
                        <h3 className="mb-4 text-lg font-semibold flex items-center gap-2 z-10">
                            <Check className="h-5 w-5 text-green-600" />
                            Anteprima e Download
                        </h3>

                        {step === 1 && !loading && (
                            <div className="flex flex-1 flex-col items-center justify-center text-center text-slate-400 z-10">
                                <FileText className="mb-4 h-20 w-20 opacity-10" />
                                <p className="text-lg font-medium">Pronto a Generare</p>
                                <p className="text-sm mt-2 max-w-xs">Compila i dettagli sulla sinistra e lascia che l'AI scriva il documento per te.</p>
                            </div>
                        )}

                        {loading && (
                            <div className="flex flex-1 flex-col items-center justify-center text-center z-10">
                                <div className="relative mb-6 h-20 w-20">
                                    <div className="absolute inset-0 animate-ping rounded-full bg-blue-500 opacity-20"></div>
                                    <div className="relative flex h-full w-full items-center justify-center rounded-full bg-white shadow-lg dark:bg-slate-800 border-2 border-blue-100 dark:border-blue-900">
                                        <Bot className="h-10 w-10 text-blue-600" />
                                    </div>
                                </div>
                                <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Analisi Requisiti GDPR</h4>
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm text-slate-500 animate-pulse">Consultazione base giuridica...</p>
                                    <p className="text-sm text-slate-500 animate-pulse delay-100">Redazione clausole personalizzate...</p>
                                    <p className="text-sm text-slate-500 animate-pulse delay-200">Verifica conformità...</p>
                                </div>
                            </div>
                        )}

                        {step === 2 && !loading && (
                            <>
                                <div className="flex-1 overflow-auto rounded-lg bg-white p-6 text-sm leading-relaxed shadow-sm dark:bg-slate-900 border font-mono whitespace-pre-wrap text-slate-800 dark:text-slate-200 z-10">
                                    {generatedDoc}
                                </div>
                                <div className="mt-4 flex gap-3 z-10">
                                    <button
                                        onClick={() => navigator.clipboard.writeText(generatedDoc)}
                                        className="flex-1 rounded-lg border bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-50 text-slate-700 shadow-sm transition-colors dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                    >
                                        Copia Testo
                                    </button>
                                    <button className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 shadow-sm transition-colors shadow-green-200 dark:shadow-none">
                                        Scarica PDF
                                    </button>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
                                    >
                                        Nuovo
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-blue-50 dark:bg-blue-900/10 blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-purple-50 dark:bg-purple-900/10 blur-3xl pointer-events-none"></div>
                    </div>
                </div>

            </div>
        </div>
    )
}
