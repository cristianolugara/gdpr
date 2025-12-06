import Link from "next/link"
import {

    LayoutDashboard,
    FileText,
    ShieldAlert,
    Bot,
    Settings,
    LogOut
} from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-white dark:bg-slate-900 md:flex">
                <div className="flex h-14 items-center border-b px-4">
                    <Link className="flex items-center gap-2 font-bold" href="/">
                        <div className="rounded-md bg-primary p-1">
                            {/* Logo icon placeholder */}
                            <div className="h-4 w-4 bg-white rounded-full" />
                        </div>
                        <span>GDPR Tool</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="grid gap-1 px-2 text-sm font-medium">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 rounded-lg bg-slate-100 px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard/documents"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                        >
                            <FileText className="h-4 w-4" />
                            Generatore Documenti
                        </Link>
                        <Link
                            href="/dashboard/register"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                        >
                            <ShieldAlert className="h-4 w-4" />
                            Registro Trattamenti
                        </Link>
                        <Link
                            href="/dashboard/ai-assistant"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                        >
                            <Bot className="h-4 w-4" />
                            Assistente AI
                        </Link>
                        <Link
                            href="/dashboard/settings"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                        >
                            <Settings className="h-4 w-4" />
                            Impostazioni
                        </Link>
                    </nav>
                </div>
                <div className="border-t p-4">
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-all hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="flex h-14 items-center justify-between border-b bg-white px-6 dark:bg-slate-900">
                    <h1 className="text-lg font-semibold">Panoramica</h1>
                    <div className="flex items-center gap-4">
                        {/* User Profile / Notifications could go here */}
                        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                    </div>
                </header>
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
