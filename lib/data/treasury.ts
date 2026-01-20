
import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

export interface Transaction {
    id: string
    created_at: string
    amount: number
    description: string
    category: string
    type: 'income' | 'expense'
    payer_id: string | null
    created_by: string
    profiles?: { full_name: string, avatar_url: string } // Join result
}

export const getTransactions = cache(async () => {
    const supabase = await createClient()
    const { data } = await supabase
        .from('transactions')
        .select('*, profiles:payer_id(full_name, avatar_url)')
        .order('created_at', { ascending: false })
    return (data as any[]) || []
})

export const getMonthlyPaymentStatus = cache(async () => {
    const supabase = await createClient()
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()

    // Get all members
    const { data: users } = await supabase.from('profiles').select('id, full_name, avatar_url').order('full_name')
    if (!users) return []

    // Get incomes this month
    const { data: incomes } = await supabase.from('transactions')
        .select('payer_id, amount')
        .eq('type', 'income')
        .gte('created_at', firstDay)
        .lt('created_at', nextMonth)

    // Map status
    return users.map(user => {
        const paid = incomes?.some(t => t.payer_id === user.id) || false
        const amount = incomes?.filter(t => t.payer_id === user.id).reduce((sum, t) => sum + t.amount, 0) || 0
        return {
            ...user,
            hasPaid: paid,
            paidAmount: amount
        }
    })
})
