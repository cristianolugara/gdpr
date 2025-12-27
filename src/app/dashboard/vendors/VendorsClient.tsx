"use client"

import { useState } from "react"
import { GdprVendor } from "@/types/gdpr"
import { Plus, Search, Filter, ShieldCheck, FileText, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createVendorAction } from "@/app/actions/gdpr"
import { useRouter } from "next/navigation"

interface VendorsClientProps {
    initialVendors: GdprVendor[]
}

// Doc 22 Checklist Items
const ASSESSMENT_ITEMS = [
    { id: "register_exists", label: "Registro Responsabile", description: "Esiste il registro delle attività di trattamento?" },
    { id: "updates_periodic", label: "Aggiornamento Registri", description: "I registri sono periodicamente aggiornati?" },
    { id: "authorized_persons", label: "Soggetti Designati", description: "Esiste elenco soggetti designati?" },
    { id: "nomination_letters", label: "Lettere Incarico", description: "Incari formali per autorizzati?" },
    { id: "sys_admin", label: "Amm. Sistema", description: "Nominato Amministratore di Sistema?" },
    { id: "sys_admin_logs", label: "Log Amm. Sistema", description: "Accessi AdS loggati?" },
    { id: "sub_processors_list", label: "Elenco Sub-Resp.", description: "Elenco aggiornato fornito?" },
    { id: "sub_processors_dpa", label: "Nomina Sub-Resp.", description: "Contratti art. 28 con sub-fornitori?" },
    { id: "rights_procedure", label: "Procedura Diritti", description: "Procedura gestione diritti interessati?" },
    { id: "breach_procedure", label: "Procedura Breach", description: "Procedura notifica Data Breach?" },
    { id: "training_periodic", label: "Formazione", description: "Formazione privacy periodica personale?" },
    { id: "security_policy", label: "Policy Sicurezza", description: "Policy sicurezza fisica/logica?" },
    { id: "physical_security", label: "Sicurezza Fisica", description: "Locali protetti e accessi controllati?" },
    { id: "backups", label: "Backup", description: "Backup periodici e sicuri?" },
    { id: "encryption", label: "Crittografia", description: "Dati/connessioni crittografati?" },
    { id: "passwords", label: "Gestione Password", description: "Password complesse e cambio periodico?" },
    { id: "antivirus", label: "Antivirus/Firewall", description: "Sistemi protetti da malware?" },
    { id: "software_updates", label: "Aggiornamenti", description: "Sistemi operativi e software aggiornati?" },
]

export default function VendorsClient({ initialVendors }: VendorsClientProps) {
    const router = useRouter()
    const [vendors, setVendors] = useState<GdprVendor[]>(initialVendors)
    const [selectedVendor, setSelectedVendor] = useState<GdprVendor | null>(null)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showAssessment, setShowAssessment] = useState(false)

    // Form State
    const [newVendor, setNewVendor] = useState<Partial<GdprVendor>>({
        name: "",
        serviceType: "",
        contactInfo: "",
        dpaStatus: "MISSING",
        securityAssessmentStatus: "PENDING",
        notes: "",
        vatNumber: "",
        pec: "",
        dpoContact: "",
        processingCategory: "",
        businessFunction: "",
        subProcessors: "",
        dataTransferInfo: "No transfer outside EU",
        assessmentData: {}
    })

    const handleCreate = async () => {
        setIsSubmitting(true)
        const result = await createVendorAction(newVendor as any)
        if (result.success) {
            setIsAddOpen(false)
            router.refresh()
            // Reset form
            setNewVendor({
                name: "",
                serviceType: "",
                contactInfo: "",
                dpaStatus: "MISSING",
                securityAssessmentStatus: "PENDING",
                notes: "",
                assessmentData: {}
            })
        } else {
            alert("Errore durante la creazione")
        }
        setIsSubmitting(false)
    }

    const updateAssessmentItem = (id: string, value: string) => {
        setNewVendor(prev => ({
            ...prev,
            assessmentData: {
                ...prev.assessmentData,
                [id]: value
            }
        }))
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

            {/* Same list code as before, simplified for brevity in this replacement */}
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
                                            <div className="text-xs text-slate-500 font-normal">{vendor.contactInfo}</div>
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

            {/* CREATE DIALOG - Expanded with new fields */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto" onClick={() => setIsAddOpen(false)}>
                    <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900 border dark:border-slate-800 my-8" onClick={e => e.stopPropagation()}>
                        <div className="mb-6">
                            <h3 className="text-xl font-bold">Nuovo Fornitore</h3>
                            <p className="text-slate-500 text-sm">Inserisci i dati anagrafici e la valutazione di sicurezza.</p>
                        </div>

                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                            {/* Anagrafica */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Ragione Sociale *</label>
                                    <input className="w-full rounded-md border border-slate-300 p-2 text-sm dark:bg-slate-950 dark:border-slate-800"
                                        value={newVendor.name} onChange={e => setNewVendor({ ...newVendor, name: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">P.IVA / CF</label>
                                    <input className="w-full rounded-md border border-slate-300 p-2 text-sm dark:bg-slate-950 dark:border-slate-800"
                                        value={newVendor.vatNumber} onChange={e => setNewVendor({ ...newVendor, vatNumber: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tipo Servizio</label>
                                    <input className="w-full rounded-md border border-slate-300 p-2 text-sm dark:bg-slate-950 dark:border-slate-800"
                                        placeholder="Es. Hosting, Consulente..."
                                        value={newVendor.serviceType} onChange={e => setNewVendor({ ...newVendor, serviceType: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email / Contatti</label>
                                    <input className="w-full rounded-md border border-slate-300 p-2 text-sm dark:bg-slate-950 dark:border-slate-800"
                                        value={newVendor.contactInfo} onChange={e => setNewVendor({ ...newVendor, contactInfo: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">PEC</label>
                                    <input className="w-full rounded-md border border-slate-300 p-2 text-sm dark:bg-slate-950 dark:border-slate-800"
                                        value={newVendor.pec} onChange={e => setNewVendor({ ...newVendor, pec: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">DPO Contact</label>
                                    <input className="w-full rounded-md border border-slate-300 p-2 text-sm dark:bg-slate-950 dark:border-slate-800"
                                        value={newVendor.dpoContact} onChange={e => setNewVendor({ ...newVendor, dpoContact: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Categoria Trattamento</label>
                                <input className="w-full rounded-md border border-slate-300 p-2 text-sm dark:bg-slate-950 dark:border-slate-800"
                                    value={newVendor.processingCategory} onChange={e => setNewVendor({ ...newVendor, processingCategory: e.target.value })} />
                            </div>

                            {/* Stato e DPA */}
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg dark:bg-slate-800/50">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Stato Nomina (DPA)</label>
                                    <select className="w-full rounded-md border p-2 text-sm"
                                        value={newVendor.dpaStatus} onChange={(e: any) => setNewVendor({ ...newVendor, dpaStatus: e.target.value })}>
                                        <option value="MISSING">Mancante</option>
                                        <option value="SIGNED">Firmato</option>
                                        <option value="NOT_REQUIRED">Non Richiesto</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Esito Valutazione</label>
                                    <select className="w-full rounded-md border p-2 text-sm"
                                        value={newVendor.securityAssessmentStatus} onChange={(e: any) => setNewVendor({ ...newVendor, securityAssessmentStatus: e.target.value })}>
                                        <option value="PENDING">In Attesa</option>
                                        <option value="APPROVED">Approvato (Adeguato)</option>
                                        <option value="REJECTED">Rifiutato (Non Adeguato)</option>
                                    </select>
                                </div>
                            </div>

                            {/* CHECKLIST TOGGLE */}
                            <div>
                                <button type="button"
                                    onClick={() => setShowAssessment(!showAssessment)}
                                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800">
                                    {showAssessment ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    Compila Checklist Valutazione (Doc 22)
                                </button>

                                {showAssessment && (
                                    <div className="mt-4 space-y-4 border-l-2 border-blue-100 pl-4">
                                        {ASSESSMENT_ITEMS.map(item => (
                                            <div key={item.id} className="grid grid-cols-[1fr,auto] gap-4 items-center border-b border-dashed pb-2">
                                                <div>
                                                    <div className="text-sm font-medium">{item.label}</div>
                                                    <div className="text-xs text-slate-500">{item.description}</div>
                                                </div>
                                                <select
                                                    className="rounded border text-sm p-1"
                                                    value={newVendor.assessmentData?.[item.id] || ""}
                                                    onChange={e => updateAssessmentItem(item.id, e.target.value)}
                                                >
                                                    <option value="">-</option>
                                                    <option value="YES">Sì</option>
                                                    <option value="NO">No</option>
                                                    <option value="NA">N/A</option>
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Note / Azioni Correttive</label>
                                <textarea className="w-full rounded-md border border-slate-300 p-2 text-sm dark:bg-slate-950 dark:border-slate-800"
                                    rows={3}
                                    value={newVendor.notes} onChange={e => setNewVendor({ ...newVendor, notes: e.target.value })} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Annulla</Button>
                            <Button onClick={handleCreate} disabled={isSubmitting}>Salva</Button>
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
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-slate-500 block">P.IVA</span>{selectedVendor.vatNumber || '-'}</div>
                                <div><span className="text-slate-500 block">PEC</span>{selectedVendor.pec || '-'}</div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg space-y-2 dark:bg-slate-800/50">
                                <div className="text-sm font-medium">Dettagli Valutazione</div>
                                <div className="text-xs text-slate-500">
                                    {selectedVendor.assessmentData ? Object.keys(selectedVendor.assessmentData).length + " punti controllati" : "Nessuna checklist compilata"}
                                </div>
                                <div className={`text-sm font-bold ${selectedVendor.securityAssessmentStatus === 'APPROVED' ? 'text-green-600' : 'text-red-500'}`}>
                                    Esito: {selectedVendor.securityAssessmentStatus}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium mb-2">Note</h4>
                                <p className="text-sm text-slate-600">{selectedVendor.notes || "Nessuna nota"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
