
import { getUserProfile } from '@/lib/data/user'
import { getActiveWarnings } from '@/lib/data/warnings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, DollarSign, UserCheck } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const profile = await getUserProfile()

    if (!profile) {
        redirect('/login')
    }

    const warnings = await getActiveWarnings(profile.id)
    const hasWarnings = warnings.length > 0

    return (
        <div className="space-y-6 pt-6">
            <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-xl font-bold">Hola, {profile.full_name || 'Soci/a'}</h1>
                    <p className="text-sm text-gray-500">Benvingut/da al Casal</p>
                </div>
                <Badge variant={profile.role === 'president' ? 'destructive' : profile.role === 'treasurer' ? 'default' : 'secondary'} className="uppercase">
                    {profile.role === 'president' ? 'President' : profile.role === 'treasurer' ? 'Tresorer' : 'Soci'}
                </Badge>
            </header>

            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <DollarSign size={16} /> Saldo Actual
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className={`text-2xl font-bold ${profile.current_balance < 0 ? 'text-red-500' : 'text-green-600'}`}>
                            {profile.current_balance.toFixed(2)}€
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <AlertTriangle size={16} /> Avisos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className={`text-2xl font-bold ${hasWarnings ? 'text-red-500' : 'text-gray-900'}`}>
                            {warnings.length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {hasWarnings && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-red-800 font-semibold mb-2 flex items-center gap-2">
                        <AlertTriangle size={18} /> Avisos Actius
                    </h3>
                    <ul className="space-y-2">
                        {warnings.map(w => (
                            <li key={w.id} className="text-sm text-red-700 bg-white p-2 rounded shadow-sm border border-red-100">
                                <span className="font-bold">Motiu:</span> {w.reason}
                                <br />
                                <span className="text-xs opacity-75">Caduca: {new Date(w.expiration_date).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {!hasWarnings && (
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-6 flex flex-col items-center text-center text-green-700">
                        <UserCheck size={32} className="mb-2" />
                        <p className="font-medium">Tot correcte! No tens cap avís.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
