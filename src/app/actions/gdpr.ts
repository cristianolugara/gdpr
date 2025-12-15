"use server"

import { revalidatePath } from "next/cache"
import { GdprRepository } from "@/lib/repositories/gdpr"
import { ProcessingActivity, GdprSubjectRequest, DataBreachIncident } from "@/types/gdpr"
import { createClient } from "@/lib/supabase/server"

export async function createActivityAction(data: Omit<ProcessingActivity, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error("Unauthorized")

        await GdprRepository.createActivity({
            ...data,
            companyId: user.id
        })

        revalidatePath('/dashboard/register')
        return { success: true }
    } catch (error) {
        console.error("Failed to create activity", error)
        return { success: false, error: "Failed to create activity" }
    }
}

export async function createRequestAction(data: Omit<GdprSubjectRequest, 'id' | 'companyId' | 'status' | 'isIdentityVerified' | 'createdAt' | 'updatedAt'>) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error("Unauthorized")

        await GdprRepository.createRequest({
            ...data,
            companyId: user.id,
            status: 'NEW',
            isIdentityVerified: false,
            // Default deadline usually 30 days, should be calculated here or passed
            // For now assuming passed or we calc here? 
            // The type Omit above implies it IS passed.
        } as any) // Casting as Omit was strict

        revalidatePath('/dashboard/requests')
        return { success: true }
    } catch (error) {
        console.error("Failed to create request", error)
        return { success: false, error: "Failed to create request" }
    }
}

export async function createBreachAction(data: Omit<DataBreachIncident, 'id' | 'companyId' | 'status' | 'createdAt' | 'updatedAt'>) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error("Unauthorized")

        await GdprRepository.createBreach({
            ...data,
            companyId: user.id,
            status: 'OPEN'
        } as any)

        revalidatePath('/dashboard/breach')
        revalidatePath('/dashboard/breach') // just in case
        return { success: true }
    } catch (error) {
        console.error("Failed to create breach", error)
        return { success: false, error: "Failed to create breach" }
    }
}
