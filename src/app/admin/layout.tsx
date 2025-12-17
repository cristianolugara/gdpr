import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Settings, LogOut } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    // If role does not exist or is not admin, redirect.
    // Note: Ensure you have run the update_schema.sql to add the role column.
    // Temporary: If role is undefined/null, we might want to allow access IF it's the specific user (bootstrap)
    // But strictly, we should rely on the role. 

    if (profile?.role !== "admin") {
        // Fallback: Check if email matches a specific env var for bootstrapping?
        // For now, let's redirect to dashboard if not admin.
        redirect("/dashboard");
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Admin Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-slate-900 text-white md:flex">
                <div className="flex h-14 items-center border-b border-slate-700 px-4">
                    <Link className="flex items-center gap-2 font-bold" href="/admin">
                        <span className="text-xl">Admin Panel</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="grid gap-1 px-2 text-sm font-medium">
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Overview
                        </Link>
                        <Link
                            href="/admin/users"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
                        >
                            <Users className="h-4 w-4" />
                            Users
                        </Link>
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:bg-slate-800 hover:text-white mt-4"
                        >
                            <LogOut className="h-4 w-4" />
                            Back to App
                        </Link>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="flex h-14 items-center justify-between border-b bg-white px-6 dark:bg-slate-900">
                    <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm">Admin: {user.email}</span>
                    </div>
                </header>
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}
