
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
                    <h1 className="text-2xl font-bold">Tresoreria</h1>
                    <p className="text-sm text-gray-500">Fons Totals: <span className={totalBalance >= 0 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>{totalBalance.toFixed(2)}€</span></p>
                </div>
                {profile?.role === 'treasurer' && (
                    <Link href="/treasury/new">
                        <Button size="sm"><Plus size={16} className="mr-1" /> Afegir</Button>
                    </Link>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Estat de quotes mensuals</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {monthlyStatus.map((u: any) => (
                            <div key={u.id} className="flex flex-col items-center">
                                <Avatar className={`h-10 w-10 border-2 ${u.hasPaid ? 'border-green-500' : 'border-gray-200 opacity-50'}`}>
                                    <AvatarFallback>{u.full_name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-[10px] mt-1">{u.full_name?.split(' ')[0]}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Transaccions Recents</CardTitle>
                </CardHeader>
                <CardContent>
                    {transactions.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No hi ha transaccions.</p>
                    ) : (
                        <ul className="space-y-4">
                            {transactions.map((t: any) => (
                                <li key={t.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                                    <div>
                                        <div className="font-medium">{t.description}</div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(t.created_at).toLocaleDateString()} - {t.profiles?.full_name || 'Desconegut'}
                                        </div>
                                    </div>
                                    <div className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
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
