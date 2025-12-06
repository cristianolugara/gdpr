import {
    FilePlus,
    Search,
    Sparkles,
    ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Hero / Welcome */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Bentornato, Alberto</h2>
                <p className="text-slate-500 dark:text-slate-400">
                    Ecco la situazione della conformità GDPR dei tuoi progetti.
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Documenti Generati", value: "12", trend: "+2 questa settimana" },
                    {
                        label: "Privacy Score",
                        value: "85%",
                        trend: "Ottimo livello",
                        customVisual: (
                            <div className="absolute right-4 top-4 h-12 w-12 rounded-full border-4 border-emerald-500 flex items-center justify-center text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20">
                                A
                            </div>
                        )
                    },
                    { label: "Progetti Attivi", value: "3", trend: "Tutti conformi" },
                    { label: "Azioni Richieste", value: "1", trend: "Bassa priorità", alert: true },
                ].map((stat, i) => (
                    <div key={i} className="relative rounded-xl border bg-card text-card-foreground shadow-sm p-6 bg-white dark:bg-slate-900">
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</div>
                        <div className={`mt-2 text-3xl font-bold ${stat.alert ? 'text-orange-500' : ''}`}>{stat.value}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.trend}</div>
                        {/* @ts-ignore */}
                        {stat.customVisual}
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Generate Policy */}
                <div className="relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900 group hover:border-blue-500 transition-colors cursor-pointer">
                    <div className="flex flex-col justify-between h-full">
                        <div>
                            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                                <FilePlus className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold">Genera Informativa</h3>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Crea una Privacy o Cookie Policy personalizzata in pochi passaggi con il supporto dell'AI.
                            </p>
                        </div>
                        <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:underline">
                            Inizia <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                    </div>
                </div>

                {/* AI Analysis */}
                <div className="relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900 group hover:border-purple-500 transition-colors cursor-pointer">
                    <div className="flex flex-col justify-between h-full">
                        <div>
                            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold">AI Auditor</h3>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Incolla un testo o un URL per analizzare la conformità GDPR e rilevare potenziali rischi.
                            </p>
                        </div>
                        <div className="mt-4 flex items-center text-sm font-medium text-purple-600 group-hover:underline">
                            Analizza ora <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                    </div>
                </div>

                {/* Register Search */}
                <div className="relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900 group hover:border-emerald-500 transition-colors cursor-pointer">
                    <div className="flex flex-col justify-between h-full">
                        <div>
                            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
                                <Search className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold">Cerca nel Registro</h3>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Consulta rapidamente il registro dei trattamenti e aggiorna le voci esistenti.
                            </p>
                        </div>
                        <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 group-hover:underline">
                            Cerca <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Documents Table (Simplified) */}
            <div className="rounded-xl border bg-white shadow-sm dark:bg-slate-900">
                <div className="p-6">
                    <h3 className="font-semibold">Documenti Recenti</h3>
                </div>
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800">
                                <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400">Nome Documento</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400">Tipo</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400">Data Creazione</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {[
                                { name: "Privacy Policy - Sito Web", type: "Informativa", date: "06 Dic 2025", status: "Completato" },
                                { name: "Registro Marketing", type: "Registro Trattamenti", date: "05 Dic 2025", status: "In Revisione" },
                                { name: "Nomina Responsabile IT", type: "Contratto", date: "03 Dic 2025", status: "Bozza" },
                            ].map((row, i) => (
                                <tr key={i} className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800">
                                    <td className="p-4 align-middle font-medium">{row.name}</td>
                                    <td className="p-4 align-middle">{row.type}</td>
                                    <td className="p-4 align-middle">{row.date}</td>
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${row.status === 'Completato' ? 'bg-green-100 text-green-800 dark:bg-green-900 text-green-300' :
                                            row.status === 'In Revisione' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 text-yellow-300' :
                                                'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                                            }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
