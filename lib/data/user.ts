
import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/types'
import { cache } from 'react'

export const getUserProfile = cache(async (): Promise<Profile | null> => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error || !data) {
        return null
    }

    return data as Profile
})
