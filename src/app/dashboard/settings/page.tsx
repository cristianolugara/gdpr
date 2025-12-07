import { getCompanySettings } from './actions'
import SettingsForm from './SettingsForm'
import { AlertCircle } from 'lucide-react'

export const metadata = {
    title: 'Impostazioni Aziendali | GDPR Tool',
    description: 'Gestisci i dati della tua azienda per i documenti GDPR.',
}

export default async function SettingsPage() {
    const companySettings = await getCompanySettings()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Impostazioni Aziendali</h2>
                <p className="text-slate-500 dark:text-slate-400">
                    Inserisci qui i dati della tua azienda. Verranno utilizzati automaticamente per compilare i documenti generati.
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-start gap-3 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                    <p className="font-semibold">Perché questi dati sono importanti?</p>
                    <p className="mt-1">
                        Queste informazioni (come Ragione Sociale, P.IVA, Indirizzo) sono obbligatorie in molti documenti legali (es. Informative Privacy, Registri).
                        Inserendoli qui, non dovrai digitarli ogni volta.
                    </p>
                </div>
            </div>

            <SettingsForm initialData={companySettings} />
        </div>
    )
}
