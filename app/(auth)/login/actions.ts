'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const nickname = formData.get('nickname') as string
    const password = formData.get('password') as string

    // 1. Resolve Nickname to Email using RPC
    const { data: email, error: rpcError } = await supabase.rpc('get_email_by_nickname', {
        query_nickname: nickname,
    })

    if (rpcError || !email) {
        redirect('/login?error=Sobrenom incorrecte o usuari no trobat')
    }

    // 2. Sign in with Email/Password
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password,
    })

    if (error) {
        redirect('/login?error=Contrasenya incorrecte')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}
