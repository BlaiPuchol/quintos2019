
import { getUserProfile } from '@/lib/data/user'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createTransaction } from '../actions' // Corrected path
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function NewTransactionPage() {
    const profile = await getUserProfile()
    if (profile?.role !== 'treasurer') {
        redirect('/treasury')
    }

    // Need list of users to select Payer for Income
    const supabase = await createClient()
    const { data: users } = await supabase.from('profiles').select('id, full_name').order('full_name')

    return (
        <div className="pt-6">
            <Card>
                <CardHeader>
                    <CardTitle>New Transaction</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createTransaction} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <select name="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="expense">Expense (Salida)</option>
                                <option value="income">Income (Entrada)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label>Amount</Label>
                            <Input name="amount" type="number" step="0.01" required />
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input name="description" placeholder="Electricity bill, Monthly quota..." required />
                        </div>

                        {/* Logic: If Income, select Payer. If Expense, Payer is null or 'System'? Actually Schema says payer_id refs profiles. For Expense, who paid? Maybe the treasurer from the pot? Or if a user paid for something and needs reimbursement?
                        Let's assume:
                        - Income: Payer = User who paid.
                        - Expense: Payer = Null (paid from funds) OR Payer = User who paid and needs reimbursement?
                        Schema: type transaction_type ('income', 'expense'). payer_id references profiles.
                        Simplification: Income -> Payer required. Expense -> Payer optional (if tracking who spent it).
                    */}
                        <div className="space-y-2">
                            <Label>Payer (Who paid?)</Label>
                            <select name="payer_id" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">-- None (Common Fund) --</option>
                                {users?.map((u: any) => (
                                    <option key={u.id} value={u.id}>{u.full_name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500">For 'Income', select the user who paid. For 'Expense', leave empty if paid from cash box.</p>
                        </div>

                        <Button type="submit" className="w-full">Save Transaction</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
