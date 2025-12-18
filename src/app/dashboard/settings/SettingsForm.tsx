'use client'

import { useState, useTransition } from 'react'
import { saveCompanySettings, CompanySettings } from './actions'
import { Loader2, Save, Building, MapPin, Mail, Phone, FileText } from 'lucide-react'

export default function SettingsForm({ initialData }: { initialData: CompanySettings | null }) {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    async function onSubmit(formData: FormData) {
        setMessage(null)
        startTransition(async () => {
            const result = await saveCompanySettings(formData)
            if (result.error) {
                setMessage({ type: 'error', text: result.error })
            } else {
                setMessage({ type: 'success', text: result.success || 'Impostazioni salvate.' })
            }
        })
    }

    return (
        <form action={onSubmit} className="space-y-8">
            {message && (
                <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {message.text}
                </div>
            )}

            {/* Dati Aziendali */}
            <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/30">
                        <Building className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Dati Aziendali</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Inserisci le informazioni principali della tua azienda.</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Ragione Sociale *</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            defaultValue={initialData?.name || ''}
                            placeholder="Es. Rossi S.r.l."
                            className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="vat_number" className="text-sm font-medium">Partita IVA</label>
                        <input
                            type="text"
                            name="vat_number"
                            id="vat_number"
                            defaultValue={initialData?.vat_number || ''}
                            placeholder="IT01234567890"
                            className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="tax_code" className="text-sm font-medium">Codice Fiscale</label>
                        <input
                            type="text"
                            name="tax_code"
                            id="tax_code"
                            defaultValue={initialData?.tax_code || ''}
                            placeholder="RSSMRA80A01H501U"
                            className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700"
                        />
                    </div>
                </div>
            </div>

            {/* Sede Legale */}
            <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg dark:bg-emerald-900/30">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Sede Legale</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Indirizzo ufficiale dell'attività.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="address" className="text-sm font-medium">Indirizzo e N. Civico</label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            defaultValue={initialData?.address || ''}
                            placeholder="Via Roma, 1"
                            className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700"
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="city" className="text-sm font-medium">Città</label>
                            <input
                                type="text"
                                name="city"
                                id="city"
                                defaultValue={initialData?.city || ''}
                                placeholder="Milano"
                                className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="zip_code" className="text-sm font-medium">CAP</label>
                            <input
                                type="text"
                                name="zip_code"
                                id="zip_code"
                                defaultValue={initialData?.zip_code || ''}
                                placeholder="20121"
                                className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Contatti */}
            <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg dark:bg-purple-900/30">
                        <Mail className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Contatti</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Recapiti per le comunicazioni ufficiali.</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email Aziendale</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            defaultValue={initialData?.email || ''}
                            placeholder="info@azienda.it"
                            className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="pec" className="text-sm font-medium">PEC</label>
                        <input
                            type="email"
                            name="pec"
                            id="pec"
                            defaultValue={initialData?.pec || ''}
                            placeholder="azienda@pec.it"
                            className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">Telefono</label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            defaultValue={initialData?.phone || ''}
                            placeholder="+39 02 1234567"
                            className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700"
                        />
                    </div>
                </div>
            </div>

            {/* Referenti & Privacy */}
            <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg dark:bg-amber-900/30">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Referenti & Privacy</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Informazioni per la compilazione dei documenti (Nomine, DPA).</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="legal_representative" className="text-sm font-medium">Legale Rappresentante *</label>
                        <input
                            type="text"
                            name="legal_representative"
                            id="legal_representative"
                            required
                            defaultValue={initialData?.legal_representative || ''}
                            placeholder="Nome e Cognome del firmatario"
                            className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700"
                        />
                        <p className="text-xs text-slate-500">Colui che firmerà i contratti e le nomine.</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="dpo_name" className="text-sm font-medium">Nome DPO (Opzionale)</label>
                            <input
                                type="text"
                                name="dpo_name"
                                id="dpo_name"
                                defaultValue={initialData?.dpo_name || ''}
                                placeholder="Nome Cognome o Società DPO"
                                className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="dpo_email" className="text-sm font-medium">Email DPO (Opzionale)</label>
                            <input
                                type="email"
                                name="dpo_email"
                                id="dpo_email"
                                defaultValue={initialData?.dpo_email || ''}
                                placeholder="dpo@azienda.it"
                                className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvataggio...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Salva Impostazioni
                        </>
                    )}
                </button>
            </div>
        </form >
    )
}
