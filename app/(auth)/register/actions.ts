'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const nickname = formData.get('nickname') as string

    // 1. Sign up with Supabase Auth (using email/password)
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: nickname, // Assuming nickname is the main name for now
            },
        },
    })

    if (authError) {
        redirect(`/register?error=${encodeURIComponent(authError.message)}`)
    }

    if (authData.user) {
        // 2. Update the profiles table with the nickname
        // Note: The 'handle_new_user' trigger might have already created the profile row.
        // We need to update it with the nickname.

        // Wait a bit? Or just update. Trigger runs synchronously usually.
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ nickname: nickname })
            .eq('id', authData.user.id)

        if (profileError) {
            console.error("Profile update error:", profileError)
            // Maybe redirect with warning? Or duplicate nickname error?
            // If duplicate nickname, we should probably check before signup... but for now let's just handle it.
            if (profileError.code === '23505') { // Unique violation
                redirect('/register?error=Nickname ja existent. Tria en un altre.')
            }
        }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}
