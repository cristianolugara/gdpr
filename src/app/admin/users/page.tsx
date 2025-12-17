import { createAdminClient } from "@/lib/supabase/admin";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"; // Assuming shadcn Table exists or falling back to simple HTML table if not
import { Badge } from "@/components/ui/badge"; // Assuming Badge exists
import { Button } from "@/components/ui/button"; // Assuming Button exists
import Link from "next/link";
import { UserCog } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
    const supabaseAdmin = createAdminClient();

    // Fetch users from Auth (requires Service Role)
    const {
        data: { users },
        error,
    } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
        return (
            <div className="p-4 text-red-500 bg-red-50 rounded border border-red-200">
                Error loading users: {error.message}. Please ensure SUPABASE_SERVICE_ROLE_KEY is set.
            </div>
        );
    }

    // Fetch profiles to get roles
    const { data: profiles, error: profilesError } = await supabaseAdmin
        .from("profiles")
        .select("id, role, full_name");

    // Map profiles to users
    const usersWithRoles = users.map((user) => {
        const profile = profiles?.find((p) => p.id === user.id);
        return {
            ...user,
            role: profile?.role || "user",
            fullName: profile?.full_name || "N/A",
        };
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Gestione Utenti</h2>
                <Button>
                    <UserCog className="mr-2 h-4 w-4" />
                    Invite User (Coming Soon)
                </Button>
            </div>

            <div className="rounded-md border bg-white dark:bg-slate-900">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800">
                                <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400">
                                    Email
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400">
                                    Nome
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400">
                                    Ruolo
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400">
                                    Creato il
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400">
                                    Ultimo Accesso
                                </th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {usersWithRoles.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800"
                                >
                                    <td className="p-4 align-middle font-medium">
                                        {user.email}
                                    </td>
                                    <td className="p-4 align-middle">{user.fullName}</td>
                                    <td className="p-4 align-middle">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${user.role === "admin"
                                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                                    : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                                                }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">
                                        {new Date(user.created_at).toLocaleDateString("it-IT")}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {user.last_sign_in_at
                                            ? new Date(user.last_sign_in_at).toLocaleDateString(
                                                "it-IT"
                                            )
                                            : "Mai"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
