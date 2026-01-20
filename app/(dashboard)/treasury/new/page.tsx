
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
            <Card className="bg-white/5 border-white/10 backdrop-blur-md text-white">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Nova Transacció</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createTransaction} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-gray-300">Tipus</Label>
                            <select name="type" className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                <option value="expense" className="bg-gray-900 text-white">Despesa (Eixida)</option>
                                <option value="income" className="bg-gray-900 text-white">Ingrés (Entrada)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-300">Quantitat (€)</Label>
                            <Input name="amount" type="number" step="0.01" placeholder="0.00" required className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-300">Descripció</Label>
                            <Input name="description" placeholder="Ex: Factura llum, Quota mensual..." required className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-300">Pagador (Qui ha pagat?)</Label>
                            <select name="payer_id" className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                <option value="" className="bg-gray-900 text-gray-400">-- Cap (Caixa Comuna) --</option>
                                {users?.map((u: any) => (
                                    <option key={u.id} value={u.id} className="bg-gray-900 text-white">{u.full_name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500">Per a 'Ingrés', selecciona qui paga. Per a 'Despesa', deixa buit si s'ha pagat de la caixa.</p>
                        </div>

                        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold border-0">Guardar Transacció</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
