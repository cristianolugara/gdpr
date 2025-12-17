export default function AdminPage() {
    return (
        <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Users</h3>
                    </div>
                    <div className="text-2xl font-bold">--</div>
                    <p className="text-xs text-muted-foreground">Admin access only</p>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">System Status</h3>
                    </div>
                    <div className="text-2xl font-bold text-green-500">Active</div>
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6 pt-0 mt-6">
                    <h3 className="text-lg font-medium mb-4">Welcome Administrator</h3>
                    <p>This area is restricted to administrators only. Here you can manage users and system settings.</p>
                </div>
            </div>
        </div>
    )
}

