'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTransaction(formData: FormData) {
    const supabase = await createClient()

    const type = formData.get('type')
    const amount = formData.get('amount')
    const description = formData.get('description')
    const payer_id = formData.get('payer_id') as string

    // Get current user for created_by
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase.from('transactions').insert({
        type,
        amount,
        description,
        payer_id: payer_id || null, // Handle empty string
        created_by: user.id
    })

    if (error) {
        console.error(error)
        // handle error
        return
    }

    revalidatePath('/treasury')
    redirect('/treasury')
}
