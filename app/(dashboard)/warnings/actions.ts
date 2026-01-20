'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createWarning(formData: FormData) {
    const supabase = await createClient()

    const target_user_id = formData.get('target_user_id') as string
    const reason = formData.get('reason') as string

    // Logic: Expiration 30 days (Configurable later)
    const expiration_date = new Date()
    expiration_date.setDate(expiration_date.getDate() + 30)

    // Get current user (must be president, RLS checks this but good to have)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase.from('warnings').insert({
        target_user_id,
        reason,
        issued_by: user.id,
        expiration_date: expiration_date.toISOString()
    })

    if (error) {
        console.error(error)
        // handle error
        return
    }

    revalidatePath('/') // Updates Dashboard
    redirect('/')
}
