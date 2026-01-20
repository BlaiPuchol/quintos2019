
import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

export interface Warning {
    id: string
    created_at: string
    target_user_id: string
    issued_by: string
    reason: string
    expiration_date: string
}

export const getActiveWarnings = cache(async (userId: string): Promise<Warning[]> => {
    const supabase = await createClient()
    const now = new Date().toISOString()

    const { data } = await supabase
        .from('warnings')
        .select('*')
        .eq('target_user_id', userId)
        .gt('expiration_date', now)
        .order('expiration_date', { ascending: true })

    return (data as Warning[]) || []
})
