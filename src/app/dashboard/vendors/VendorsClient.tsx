"use client"

import { useState } from "react"
import { GdprVendor } from "@/types/gdpr"
import { Plus, Search, Filter, ShieldCheck, FileText, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createVendorAction } from "@/app/actions/gdpr"
import { useRouter } from "next/navigation"

interface VendorsClientProps {
    initialVendors: GdprVendor[]
}

export default function VendorsClient({ initialVendors }: VendorsClientProps) {
    const router = useRouter()
    const [vendors, setVendors] = useState<GdprVendor[]>(initialVendors)
    const [selectedVendor, setSelectedVendor] = useState<GdprVendor | null>(null)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State
    const [newVendor, setNewVendor] = useState<Partial<GdprVendor>>({
        name: "",
        serviceType: "",
        contactInfo: "",
        dpaStatus: "MISSING",
        securityAssessmentStatus: "PENDING",
        notes: ""
    })

    const handleCreate = async () => {
        setIsSubmitting(true)
        const result = await createVendorAction(newVendor as any)
        if (result.success) {
            setIsAddOpen(false)
            router.refresh()
            // Optimistic update could go here
        } else {
            alert("Errore durante la creazione")
        }
        setIsSubmitting(false)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Registro Responsabili Esterni</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Art. 28 GDPR - Gestisci i fornitori che trattano dati per tuo conto.
                    </p>
                </div>
                <Button onClick={() => setIsAddOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuovo Fornitore
                </Button>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        placeholder="Cerca fornitori..."
                        className="w-full rounded-md border border-slate-300 bg-transparent pl-9 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700"
                    />
                </div>
                {/* Filters could go here */}
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                <div className="w-full overflow-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Fornitore</th>
                                <th className="px-6 py-4">Tipo Servizio</th>
                                <th className="px-6 py-4">Stato DPA</th>
                                <th className="px-6 py-4">Valutazione Sicurezza</th>
                                <th className="px-6 py-4">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {initialVendors.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        Nessun fornitore registrato.
                                    </td>
                                </tr>
                            ) : (
                                initialVendors.map((vendor) => (
                                    <tr key={vendor.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                                            {vendor.name}
                                            {vendor.contactInfo && (
                                                <div className="text-xs text-slate-500 font-normal">{vendor.contactInfo}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {vendor.serviceType || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${vendor.dpaStatus === 'SIGNED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                                    vendor.dpaStatus === 'NOT_REQUIRED' ? 'bg-slate-100 text-slate-600' :
                                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                                }`}>
                                                {vendor.dpaStatus === 'SIGNED' ? 'Firmato' : vendor.dpaStatus === 'MISSING' ? 'Mancante' : 'Non Richiesto'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {vendor.securityAssessmentStatus === 'APPROVED' ? (
                                                    <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                                        <ShieldCheck className="h-3 w-3" />
                                                        Adeguato
                                                    </span>
                                                ) : vendor.securityAssessmentStatus === 'REJECTED' ? (
                                                    <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
                                                        <AlertTriangle className="h-3 w-3" />
                                                        Inadeguato
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-xs">In attesa</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button variant="ghost" size="sm" onClick={() => setSelectedVendor(vendor)}>
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

            {/* CREATE DIALOG */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setIsAddOpen(false)}>
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900 border dark:border-slate-800" onClick={e => e.stopPropagation()}>
                        <div className="mb-6">
                            <h3 className="text-xl font-bold">Nuovo Fornitore</h3>
                            <p className="text-slate-500 text-sm">Aggiungi un nuovo responsabile esterno.</p>
                        </div>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Nome Fornitore o Ragione Sociale</label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                                    value={newVendor.name}
                                    onChange={e => setNewVendor({ ...newVendor, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Servizio (es. Hosting, Payroll)</label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                                    value={newVendor.serviceType}
                                    onChange={e => setNewVendor({ ...newVendor, serviceType: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Contatti</label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                                    value={newVendor.contactInfo}
                                    onChange={e => setNewVendor({ ...newVendor, contactInfo: e.target.value })}
                                    placeholder="Email o referente"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Stato DPA</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                                        value={newVendor.dpaStatus}
                                        onChange={(e: any) => setNewVendor({ ...newVendor, dpaStatus: e.target.value })}
                                    >
                                        <option value="MISSING">Mancante</option>
                                        <option value="SIGNED">Firmato</option>
                                        <option value="NOT_REQUIRED">Non Richiesto</option>
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Assessment Sicurezza</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                                        value={newVendor.securityAssessmentStatus}
                                        onChange={(e: any) => setNewVendor({ ...newVendor, securityAssessmentStatus: e.target.value })}
                                    >
                                        <option value="PENDING">Da Valutare</option>
                                        <option value="APPROVED">Adeguato</option>
                                        <option value="REJECTED">Inadeguato</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Note</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                                    value={newVendor.notes}
                                    onChange={e => setNewVendor({ ...newVendor, notes: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Annulla</Button>
                            <Button onClick={handleCreate} disabled={isSubmitting}>
                                {isSubmitting ? 'Salvataggio...' : 'Salva Fornitore'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* DETAILS MODAL */}
            {selectedVendor && (
                <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 backdrop-blur-sm transition-all" onClick={() => setSelectedVendor(null)}>
                    <div className="h-full w-full max-w-md bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border-l dark:border-slate-800 overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold">{selectedVendor.name}</h3>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedVendor(null)}>Chiudi</Button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-slate-500">Servizio</span>
                                <span className="font-medium text-lg">{selectedVendor.serviceType || 'N/A'}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                                    <div className="text-xs text-slate-500 mb-1">DPA (Nomina)</div>
                                    <div className={`font-semibold ${selectedVendor.dpaStatus === 'SIGNED' ? 'text-green-600' : 'text-red-500'}`}>
                                        {selectedVendor.dpaStatus === 'SIGNED' ? 'Firmato ✅' : 'Mancante ❌'}
                                    </div>
                                </div>
                                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                                    <div className="text-xs text-slate-500 mb-1">Sicurezza</div>
                                    <div className={`font-semibold ${selectedVendor.securityAssessmentStatus === 'APPROVED' ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {selectedVendor.securityAssessmentStatus === 'APPROVED' ? 'Ok' : 'In attesa'}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold uppercase text-slate-500 mb-2">Note</h4>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{selectedVendor.notes || 'Nessuna nota.'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
