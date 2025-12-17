import {
    FilePlus,
    Search,
    Sparkles,
    ArrowRight,
    AlertCircle
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TaskFlow } from "@/components/dashboard/TaskFlow"

export default async function DashboardPage() {
    const supabase = await createClient()

    // Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (!user || authError) {
        redirect('/login')
    }

    const userName = user.user_metadata.full_name || user.email?.split('@')[0] || 'Utente'

    // Fetch Stats Data
    // 1. Documents Count
    const { count: docsCount, error: docsError } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })

    // 2. Active Projects & Privacy Score
    const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('status, privacy_score')

    // Calculate Stats
    const totalProjects = projects?.length || 0
    const compliantProjects = projects?.filter(p => p.status === 'Compliant').length || 0

    // Calculate Average Privacy Score (or 0 if no projects)
    const avgScore = totalProjects > 0
        ? Math.round(projects!.reduce((acc, curr) => acc + (curr.privacy_score || 0), 0) / totalProjects)
        : 0

    // Calculate Actions Required (Example logic: 1 action per non-compliant project)
    const actionsRequired = (totalProjects - compliantProjects)

    // Fetch Recent Documents
    const { data: recentDocs } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

    // --- TASK FLOW CHECKS ---
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const lastMonthISO = lastMonth.toISOString()

    // 1. Check Profile (Full Name exists is guaranteed by auth, check company name maybe?)
    const hasProfile = !!(user.user_metadata.full_name || userName)

    // 2. Check Activities
    const { count: activitiesCount } = await supabase.from('gdpr_processing_activities').select('*', { count: 'exact', head: true }).eq('user_id', user.id)

    // 3. Check Vendors
    const { count: vendorsCount } = await supabase.from('gdpr_vendors').select('*', { count: 'exact', head: true }).eq('user_id', user.id)

    // 4. Check Training
    const { count: trainingCount } = await supabase.from('gdpr_training').select('*', { count: 'exact', head: true }).eq('user_id', user.id)

    // 5. Check Recent Security Audit
    const { count: securityCount } = await supabase.from('gdpr_audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('type', 'SECURITY_CHECK')
        .gte('date', lastMonthISO)

    // 6. Check Recent Backup Audit
    const { count: backupCount } = await supabase.from('gdpr_audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('type', 'BACKUP_CHECK')
        .gte('date', lastMonthISO)

    const taskStatus = {
        hasProfile: true, // Assuming basic profile is there if logged in
        hasActivities: (activitiesCount || 0) > 0,
        hasVendors: (vendorsCount || 0) > 0,
        hasTraining: (trainingCount || 0) > 0,
        hasRecentSecurityCheck: (securityCount || 0) > 0,
        hasRecentBackupCheck: (backupCount || 0) > 0
    }

    return (
        <div className="space-y-8">
            {/* Task Flow / Onboarding */}
            <TaskFlow status={taskStatus} />

            {/* Hero / Welcome */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Ciao, {userName}</h2>
                <p className="text-slate-500 dark:text-slate-400">
                    Ecco la situazione della conformità GDPR dei tuoi progetti.
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    {
                        label: "Documenti Generati",
                        value: docsCount || 0,
                        trend: "Totali"
                    },
                    {
                        label: "Privacy Score",
                        value: `${avgScore}%`,
                        trend: totalProjects > 0 ? "Media progetti" : "Nessun progetto",
                        customVisual: (
                            <div className={`absolute right-4 top-4 h-12 w-12 rounded-full border-4 flex items-center justify-center text-[10px] font-bold 
                                ${avgScore >= 70 ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' :
                                    avgScore >= 40 ? 'border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' :
                                        'border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20'}`}>
                                {avgScore >= 90 ? 'A' : avgScore >= 70 ? 'B' : avgScore >= 50 ? 'C' : 'D'}
                            </div>
                        )
                    },
                    {
                        label: "Progetti Attivi",
                        value: totalProjects || 0,
                        trend: `${compliantProjects} conformi`
                    },
                    {
                        label: "Azioni Richieste",
                        value: actionsRequired,
                        trend: actionsRequired > 0 ? "Attenzione necessaria" : "Tutto ok",
                        alert: actionsRequired > 0
                    },
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

            {/* Recent Documents Table */}
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
                            {(!recentDocs || recentDocs.length === 0) ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-slate-500">
                                        Nessun documento trovato. Inizia generandone uno!
                                    </td>
                                </tr>
                            ) : (
                                recentDocs.map((doc: any, i: number) => (
                                    <tr key={doc.id || i} className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800">
                                        <td className="p-4 align-middle font-medium">{doc.name}</td>
                                        <td className="p-4 align-middle">{doc.type}</td>
                                        <td className="p-4 align-middle">{new Date(doc.created_at).toLocaleDateString('it-IT')}</td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${doc.status === 'Completato' ? 'bg-green-100 text-green-800 dark:bg-green-900 text-green-300' :
                                                doc.status === 'In Revisione' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 text-yellow-300' :
                                                    'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                                                }`}>
                                                {doc.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
