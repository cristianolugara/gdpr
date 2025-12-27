import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 text-center">
                <div className="flex flex-col items-center">
                    <div className="rounded-full bg-red-100 p-3 mb-4 dark:bg-red-900/30">
                        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        Errore di Autenticazione
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Si è verificato un problema durante il tentativo di accesso.
                        Il link potrebbe essere scaduto o non valido.
                    </p>
                </div>

                <div className="mt-6">
                    <Link href="/login">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            Torna al Login
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
