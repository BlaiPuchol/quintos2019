'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPoll(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const is_anonymous = formData.get('is_anonymous') === 'on'
    const optionsString = formData.get('options') as string // "Yes, No" split by newline or comma

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // 1. Create Vote
    const { data: vote, error: voteError } = await supabase.from('votes').insert({
        title,
        description,
        is_anonymous,
        created_by: user.id
    }).select().single()

    if (voteError || !vote) {
        console.error(voteError)
        return
    }

    // 2. Create Options
    const options = optionsString.split(',').map(s => s.trim()).filter(Boolean)
    const optionsData = options.map(label => ({
        vote_id: vote.id,
        label
    }))

    const { error: optError } = await supabase.from('vote_options').insert(optionsData)

    if (optError) {
        console.error(optError)
        // Cleanup?
    }

    revalidatePath('/votes')
    redirect('/votes')
}

export async function castVote(voteId: string, optionId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Check if already voted
    // RLS handles insertion unique constraint? DB constraint unique(vote_id, user_id) handles it.

    const { error } = await supabase.from('cast_votes').insert({
        vote_id: voteId,
        option_id: optionId,
        user_id: user.id
    })

    if (error) {
        console.error("Vote failed", error)
        // could redirect with error
    }

    revalidatePath(`/votes/${voteId}`)
}
