import { Plus, Search, Filter } from "lucide-react"

export default function RegisterPage() {
    const activities = [
        {
            id: 1,
            name: "Gestione Clienti (CRM)",
            purpose: "Esecuzione del contratto",
            categories: "Anagrafiche, Contatti, Fatturazione",
            recipients: "Commercialista, Provider Gestionale",
            retention: "10 anni",
            status: "Activo"
        },
        {
            id: 2,
            name: "Newsletter Marketing",
            purpose: "Marketing diretto (Consenso)",
            categories: "Email, Nome",
            recipients: "Mailchimp (USA)",
            retention: "Fino a revoca",
            status: "Activo"
        },
        {
            id: 3,
            name: "Videosorveglianza",
            purpose: "Sicurezza (Legittimo Interesse)",
            categories: "Immagini video",
            recipients: "Vigilanza Privata",
            retention: "24 ore",
            status: "Sospeso"
        },
        {
            id: 4,
            name: "Selezione del Personale",
            purpose: "Misure precontrattuali",
            categories: "CV, Foto, Dati particolari",
            recipients: "HR Interno",
            retention: "12 mesi",
            status: "Activo"
        }
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Registro dei Trattamenti</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Art. 30 GDPR - Gestisci le attività di trattamento dati della tua organizzazione.
                    </p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors">
                    <Plus className="h-4 w-4" />
                    Nuova Attività
                </button>
            </div>

            <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-900">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        placeholder="Cerca attività..."
                        className="w-full rounded-md border border-slate-300 pl-9 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                    />
                </div>
                <button className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-slate-50">
                    <Filter className="h-4 w-4" />
                    Filtri
                </button>
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden dark:bg-slate-900">
                <div className="w-full overflow-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Attività di Trattamento</th>
                                <th className="px-6 py-4">Finalità & Base Giuridica</th>
                                <th className="px-6 py-4">Categorie Dati</th>
                                <th className="px-6 py-4">Destinatari</th>
                                <th className="px-6 py-4">Conservazione</th>
                                <th className="px-6 py-4">Stato</th>
                                <th className="px-6 py-4">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {activities.map((activity) => (
                                <tr key={activity.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{activity.name}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{activity.purpose}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{activity.categories}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{activity.recipients}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{activity.retention}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${activity.status === 'Activo'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                            }`}>
                                            {activity.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        <button className="text-blue-600 hover:underline mr-3">Modifica</button>
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
