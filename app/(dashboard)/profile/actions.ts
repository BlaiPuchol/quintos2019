'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateRole(userId: string, newRole: string) {
    const supabase = await createClient()

    try {
        if (newRole === 'president') {
            const { error } = await supabase.rpc('transfer_presidency', { new_president_id: userId })
            if (error) throw error
        } else {
            const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
            if (error) throw error
        }
        revalidatePath('/profile')
        revalidatePath('/', 'layout')
    } catch (error) {
        console.error('Failed to update role', error)
        // In a real app, return error to UI
    }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
}
