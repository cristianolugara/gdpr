
'use client'

import { useState, useTransition } from 'react'
import { createStaffMember, ActionState } from './actions'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-react'

export default function NewStaffModal() {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    async function onSubmit(formData: FormData) {
        setError(null)
        startTransition(async () => {
            const result = await createStaffMember(formData)
            if (result.error) {
                setError(result.error)
            } else {
                setOpen(false)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuovo Membro
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Aggiungi Personale</DialogTitle>
                </DialogHeader>

                <form action={onSubmit} className="space-y-4 py-4">
                    {error && (
                        <div className="p-3 text-sm bg-red-50 text-red-600 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="first_name" className="text-sm font-medium">Nome *</label>
                            <input
                                name="first_name"
                                required
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-950 dark:border-slate-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="last_name" className="text-sm font-medium">Cognome *</label>
                            <input
                                name="last_name"
                                required
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-950 dark:border-slate-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email Aziendale</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-950 dark:border-slate-800"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="role" className="text-sm font-medium">Ruolo / Mansione</label>
                            <input
                                name="role"
                                placeholder="es. HR Specialist"
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-950 dark:border-slate-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="employment_type" className="text-sm font-medium">Tipologia *</label>
                            <select
                                name="employment_type"
                                required
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-950 dark:border-slate-800"
                            >
                                <option value="INTERNAL">Dipendente Interno</option>
                                <option value="EXTERNAL">Collaboratore Esterno</option>
                                <option value="AUTONOMOUS">Autonomo (Sede)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="appointment_date" className="text-sm font-medium">Data Assunzione / Inizio</label>
                        <input
                            type="date"
                            name="appointment_date"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-950 dark:border-slate-800"
                        />
                    </div>

                    <div className="flex items-center gap-4 py-2">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center h-5">
                                <input id="has_signed_appointment" name="has_signed_appointment" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            </div>
                            <label htmlFor="has_signed_appointment" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Nomina Firmata?
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center h-5">
                                <input id="has_signed_nda" name="has_signed_nda" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            </div>
                            <label htmlFor="has_signed_nda" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                NDA Firmato?
                            </label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annulla</Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Crea Membro
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
