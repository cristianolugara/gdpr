"use client"

import { useState } from "react"
import { GdprSubjectRequest, GdprRequestType, GdprRequestStatus } from "@/types/gdpr"
import { GDPR_TEMPLATES } from "@/lib/data/gdpr-templates"
import { Button } from "@/components/ui/button"
// Removed missing imports
import { createRequestAction } from "@/app/actions/gdpr"
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
    Eye
} from "lucide-react"
import { useRouter } from "next/navigation"

interface RequestsClientProps {
    initialRequests: GdprSubjectRequest[]
    userName?: string
    companyName?: string
}

export default function RequestsClient({ initialRequests, userName, companyName }: RequestsClientProps) {
    const router = useRouter()
    const [requests, setRequests] = useState<GdprSubjectRequest[]>(initialRequests)
    const [selectedRequest, setSelectedRequest] = useState<GdprSubjectRequest | null>(null)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State
    const [newRequest, setNewRequest] = useState<Partial<GdprSubjectRequest>>({
        requesterName: "",
        requesterEmail: "",
        type: "ACCESS",
        requestDate: new Date().toISOString().split('T')[0],
        deadlineDate: "", // will be calc
        notes: ""
    })

    const handleCreate = async () => {
        setIsSubmitting(true)
        // Auto calc deadline +30 days
        const reqDate = new Date(newRequest.requestDate || new Date())
        const deadline = new Date(reqDate)
        deadline.setDate(deadline.getDate() + 30)

        const payload = {
            ...newRequest,
            deadlineDate: deadline.toISOString(),
            requestDate: new Date(newRequest.requestDate!).toISOString()
        }

        const result = await createRequestAction(payload as any)
        if (result.success) {
            setIsAddOpen(false)
            router.refresh()
        } else {
            alert("Errore creazione richiesta")
        }
        setIsSubmitting(false)
    }

    const getStatusColor = (status: GdprRequestStatus) => {
        switch (status) {
            case 'NEW': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            case 'VERIFYING_IDENTITY': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            case 'PROCESSING': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
            case 'COMPLETED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            case 'REJECTED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            default: return 'bg-slate-100 text-slate-700'
        }
    }

    const getTypeLabel = (type: GdprRequestType) => {
        switch (type) {
            case 'ACCESS': return 'Accesso (Art. 15)'
            case 'RECTIFICATION': return 'Rettifica (Art. 16)'
            case 'CANCELLATION': return 'Cancellazione (Art. 17)'
            case 'LIMITATION': return 'Limitazione (Art. 18)'
            case 'PORTABILITY': return 'Portabilità (Art. 20)'
            default: return type
        }
    }

    // Simple countdown calculator
    const getDaysLeft = (deadline: string) => {
        const today = new Date()
        const due = new Date(deadline)
        const diffTime = due.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Gestione Richieste Interessati</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Gestisci le richieste di esercizio dei diritti GDPR (Accesso, Rettifica, Cancellazione, ecc.)
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setIsAddOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuova Richiesta
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">In Attesa</p>
                            <h3 className="text-2xl font-bold">{requests.filter(r => r.status !== 'COMPLETED' && r.status !== 'REJECTED').length}</h3>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Scadenza &lt; 7gg</p>
                            <h3 className="text-2xl font-bold">
                                {requests.filter(r => {
                                    const days = getDaysLeft(r.deadlineDate);
                                    return days <= 7 && days >= 0 && r.status !== 'COMPLETED';
                                }).length}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Completate</p>
                            <h3 className="text-2xl font-bold">{requests.filter(r => r.status === 'COMPLETED').length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="rounded-xl border bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center justify-between border-b p-4 dark:border-slate-800">
                    <div className="flex items-center gap-2 rounded-md border bg-slate-50 px-3 py-2 dark:bg-slate-800 dark:border-slate-700">
                        <Search className="h-4 w-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Cerca richiedente..."
                            className="bg-transparent text-sm outline-none placeholder:text-slate-500"
                        />
                    </div>
                    <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtra
                    </Button>
                </div>

                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-slate-50/50 data-[state=selected]:bg-slate-50 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800">
                                <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400">Richiedente</th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400">Tipo Richiesta</th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400">Stato</th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400">Scadenza</th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-500 dark:text-slate-400">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        Nessuna richiesta ricevuta.
                                    </td>
                                </tr>
                            ) : (
                                requests.map((request) => (
                                    <tr key={request.id} className="border-b transition-colors hover:bg-slate-50/50 data-[state=selected]:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                                        <td className="p-4 align-middle font-medium">
                                            <div className="flex flex-col">
                                                <span>{request.requesterName}</span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">{request.requesterEmail}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-slate-500" />
                                                <span>{getTypeLabel(request.type)}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(request.status)}`}>
                                                {request.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {request.status !== 'COMPLETED' && request.status !== 'REJECTED' ? (
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-medium ${getDaysLeft(request.deadlineDate) < 7 ? 'text-red-600 dark:text-red-400' : ''}`}>
                                                        {new Date(request.deadlineDate).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        ({getDaysLeft(request.deadlineDate)} gg rimasti)
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-500">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(request)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
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
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900 border dark:border-slate-800" onClick={e => e.stopPropagation()}>
                        <div className="mb-6">
                            <h3 className="text-xl font-bold">Nuova Richiesta Interessato</h3>
                            <p className="text-slate-500 text-sm">Inserisci i dati della richiesta ricevuta per avviare il protocollo.</p>
                        </div>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label htmlFor="reqName" className="text-sm font-medium">Nome Richiedente</label>
                                    <input
                                        id="reqName"
                                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
                                        value={newRequest.requesterName}
                                        onChange={e => setNewRequest({ ...newRequest, requesterName: e.target.value })}
                                        placeholder="Mario Rossi"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="reqEmail" className="text-sm font-medium">Email</label>
                                    <input
                                        id="reqEmail"
                                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
                                        value={newRequest.requesterEmail}
                                        onChange={e => setNewRequest({ ...newRequest, requesterEmail: e.target.value })}
                                        placeholder="mario@example.com"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="type" className="text-sm font-medium">Tipo Richiesta</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
                                    value={newRequest.type}
                                    onChange={(e: any) => setNewRequest({ ...newRequest, type: e.target.value })}
                                >
                                    <option value="ACCESS">Accesso</option>
                                    <option value="RECTIFICATION">Rettifica</option>
                                    <option value="CANCELLATION">Cancellazione</option>
                                    <option value="LIMITATION">Limitazione</option>
                                    <option value="PORTABILITY">Portabilità</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="date" className="text-sm font-medium">Data Ricezione</label>
                                <input
                                    id="date"
                                    type="date"
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
                                    value={newRequest.requestDate}
                                    onChange={e => setNewRequest({ ...newRequest, requestDate: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="notes" className="text-sm font-medium">Note Interne</label>
                                <textarea
                                    id="notes"
                                    className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950"
                                    value={newRequest.notes}
                                    onChange={e => setNewRequest({ ...newRequest, notes: e.target.value })}
                                    placeholder="Eventuali dettagli aggiuntivi..."
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Annulla</Button>
                            <Button onClick={handleCreate} disabled={isSubmitting}>
                                {isSubmitting ? 'Salvataggio...' : 'Crea Richiesta'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Simple Detail View / Template Preview Modal (Inline for now) */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900 border dark:border-slate-800">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold">Dettaglio Richiesta {selectedRequest.id}</h3>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(null)}>Chiudi</Button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                                <div>
                                    <span className="text-xs font-semibold uppercase text-slate-500">Richiedente</span>
                                    <p>{selectedRequest.requesterName}</p>
                                    <p className="text-sm text-slate-500">{selectedRequest.requesterEmail}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold uppercase text-slate-500">Stato</span>
                                    <div>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                                            {selectedRequest.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {!selectedRequest.isIdentityVerified && selectedRequest.status !== 'COMPLETED' && (
                                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-200">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 mt-0.5" />
                                        <div>
                                            <p className="font-semibold">Identità non verificata</p>
                                            <p className="text-sm">Assicurati di richiedere un documento di identità valido prima di procedere con l'elaborazione dei dati.</p>
                                            <Button size="sm" variant="outline" className="mt-2 bg-transparent border-yellow-600 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-400 dark:text-yellow-100">
                                                Segna come Verificata
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h4 className="mb-2 font-semibold">Risposta Suggerita</h4>
                                <div className="rounded-md border bg-slate-50 p-4 text-sm font-mono dark:bg-slate-950 dark:border-slate-800 max-h-60 overflow-y-auto whitespace-pre-wrap">
                                    {GDPR_TEMPLATES[selectedRequest.type]?.content
                                        .replace('{{requesterName}}', selectedRequest.requesterName)
                                        .replace('{{city}}', 'Genova') // Mock
                                        .replace('{{date}}', new Date().toLocaleDateString())
                                        .replace('{{companyName}}', companyName || 'La Tua Azienda')
                                        .replace('{{handlerName}}', userName || 'Il Titolare')
                                        .replace('{{handlerPosition}}', 'Titolare del Trattamento')
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setSelectedRequest(null)}>Chiudi</Button>
                            <Button>Genera PDF Risposta</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function AlertTriangle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </svg>
    )
}
