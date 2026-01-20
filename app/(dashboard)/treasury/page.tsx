
import { getUserProfile } from '@/lib/data/user'
import { getTransactions, getMonthlyPaymentStatus } from '@/lib/data/treasury'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default async function TreasuryPage() {
    const profile = await getUserProfile()
    const transactions = await getTransactions()
    const monthlyStatus = await getMonthlyPaymentStatus()

    // Calculate total balance (mock or real?) 
    // Real balance should be sum(income) - sum(expense).
    const totalBalance = transactions.reduce((acc: any, t: any) => {
        return acc + (t.type === 'income' ? t.amount : -t.amount)
    }, 0)

    return (
        <div className="space-y-6 pt-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tresoreria</h1>
                    <p className="text-sm text-gray-400">Fons Totals: <span className={totalBalance >= 0 ? "text-green-400 font-bold drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" : "text-red-400 font-bold drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]"}>{totalBalance.toFixed(2)}€</span></p>
                </div>
                {profile?.role === 'treasurer' && (
                    <Link href="/treasury/new">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white border-0"><Plus size={16} className="mr-1" /> Afegir</Button>
                    </Link>
                )}
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md text-white">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-widest">Estat de quotes mensuals</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {monthlyStatus.map((u: any) => (
                            <div key={u.id} className="flex flex-col items-center">
                                <Avatar className={`h-10 w-10 border-2 ${u.hasPaid ? 'border-green-500' : 'border-white/10 opacity-50'}`}>
                                    <AvatarFallback className="bg-gray-800 text-white">{u.full_name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-[10px] mt-1 text-gray-300">{u.full_name?.split(' ')[0]}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md text-white">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Transaccions Recents</CardTitle>
                </CardHeader>
                <CardContent>
                    {transactions.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No hi ha transaccions.</p>
                    ) : (
                        <ul className="space-y-4">
                            {transactions.map((t: any) => (
                                <li key={t.id} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {t.type === 'income' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{t.description}</div>
                                            <div className="text-xs text-gray-400">
                                                {new Date(t.created_at).toLocaleDateString()} • {t.profiles?.full_name || 'Desconegut'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`font-bold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                        {t.type === 'income' ? '+' : '-'}{Math.abs(t.amount).toFixed(2)}€
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
