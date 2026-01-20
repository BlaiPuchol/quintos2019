
import { getUserProfile } from '@/lib/data/user'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createWarning } from './actions'
import { redirect } from 'next/navigation'

export default async function WarningsPage() {
    const profile = await getUserProfile()
    if (profile?.role !== 'president') {
        return (
            <div className="pt-6">
                <Card className="bg-white/5 border-white/10 text-white">
                    <CardContent className="p-6 text-center">
                        <p className="text-lg">Només el President té accés al sistema d'avisos (Llimons).</p>
                        <br />
                        <p className="text-sm text-gray-500">Consulta el teu panell principal per veure si tens avisos.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const supabase = await createClient()
    const { data: users } = await supabase.from('profiles').select('*').order('full_name')

    return (
        <div className="pt-6 space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-md text-white">
                <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2 text-yellow-400">
                        <span>🍋</span> Posar un llimó (Avisos)
                    </CardTitle>
                    <CardDescription className="text-gray-400">Els avisos caduquen automàticament als 30 dies.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={createWarning} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-gray-300">Soci / Membre</Label>
                            <select name="target_user_id" className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                {users?.map((u: any) => (
                                    <option key={u.id} value={u.id} className="bg-gray-900 text-white">{u.full_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-300">Motiu</Label>
                            <Input name="reason" placeholder="Ex: Deixar plats bruts, fer soroll..." required className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                        </div>

                        <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold border-0">
                            Posar Llimó
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* List of recent warnings could go here */}
        </div>
    )
}
