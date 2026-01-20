
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
            <header className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                <div>
                    <h1 className="text-xl font-bold text-white">Hola, {profile.full_name?.split(' ')[0] || 'Soci'}</h1>
                    <p className="text-sm text-gray-400">Benvingut/da</p>
                </div>
                <Badge variant={profile.role === 'president' ? 'destructive' : profile.role === 'treasurer' ? 'default' : 'secondary'} className="uppercase px-3 py-1">
                    {profile.role === 'president' ? 'President/a' : profile.role === 'treasurer' ? 'Tresorer/a' : 'Soci/a'}
                </Badge>
            </header>

            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white/5 border-white/10 backdrop-blur-md text-white">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <DollarSign size={14} /> Saldo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className={`text-2xl font-bold ${profile.current_balance < 0 ? 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]' : 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]'}`}>
                            {profile.current_balance.toFixed(2)}€
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-md text-white">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <AlertTriangle size={14} /> Avisos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className={`text-2xl font-bold ${hasWarnings ? 'text-red-400' : 'text-white'}`}>
                            {warnings.length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {hasWarnings && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-md">
                    <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                        <AlertTriangle size={16} /> Avisos Actius
                    </h3>
                    <ul className="space-y-3">
                        {warnings.map(w => (
                            <li key={w.id} className="text-sm text-gray-300 bg-black/40 p-3 rounded-lg border border-white/5 flex justify-between items-start">
                                <div>
                                    <span className="font-semibold text-white block mb-1">Motiu:</span>
                                    {w.reason}
                                </div>
                                <span className="text-xs text-red-400 font-mono bg-red-900/30 px-2 py-1 rounded">
                                    {new Date(w.expiration_date).toLocaleDateString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {!hasWarnings && (
                <Card className="bg-green-900/10 border-green-500/20 backdrop-blur-md">
                    <CardContent className="p-6 flex flex-col items-center text-center text-green-400">
                        <UserCheck size={32} className="mb-2 opacity-80" />
                        <p className="font-medium">Tot correcte! A gaudir de la festa.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
