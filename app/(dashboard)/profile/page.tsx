
import { getUserProfile } from '@/lib/data/user'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label' // Added Label import
import { updateRole, signOut } from './actions'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
    const profile = await getUserProfile()
    if (!profile) redirect('/login')

    // If President, fetch all profiles to manage
    let allProfiles = []
    if (profile.role === 'president') {
        const supabase = await createClient()
        const { data } = await supabase.from('profiles').select('*').order('full_name')
        allProfiles = data || []
    }

    return (
        <div className="space-y-6 pt-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">El teu Perfil</h1>
                <form action={signOut}>
                    <Button variant="destructive" size="sm" className="bg-red-600/20 text-red-400 hover:bg-red-600/40 border-0">Tancar Sessió</Button>
                </form>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md text-white">
                <CardHeader className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4 border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                        <AvatarImage src={profile.avatar_url || ''} />
                        <AvatarFallback className="bg-gray-800 text-white text-2xl">{profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl">{profile.full_name}</CardTitle>
                    <div className="mt-2">
                        <Badge variant="outline" className="border-purple-500 text-purple-400 uppercase tracking-widest text-[10px] py-1 px-2">{profile.role === 'president' ? 'President/a' : profile.role === 'treasurer' ? 'Tresorer/a' : 'Soci/a'}</Badge>
                    </div>
                    <CardDescription className="text-gray-400">@{profile.nickname || 'sense_alias'}</CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-md text-white">
                    <CardHeader>
                        <CardTitle className="text-lg">Dades Personals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label className="text-gray-400 text-xs uppercase">Nom</Label>
                            <div className="font-medium p-3 bg-white/5 rounded-lg border border-white/5 text-gray-200">{profile.full_name || 'Desconegut'}</div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-gray-400 text-xs uppercase">Email</Label>
                            <div className="font-medium p-3 bg-white/5 rounded-lg border border-white/5 text-gray-200">{profile.email}</div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-gray-400 text-xs uppercase">Sobrenom</Label>
                            <div className="font-medium p-3 bg-white/5 rounded-lg border border-white/5 text-gray-200 text-purple-300">@{profile.nickname || '-'}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-md text-white">
                    <CardHeader>
                        <CardTitle className="text-lg">Situació Financera</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <Label className="text-gray-400 text-xs uppercase">Saldo Actual</Label>
                            <div className={`text-4xl font-bold py-2 ${profile.current_balance < 0 ? 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.4)]' : 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.4)]'}`}>
                                {profile.current_balance.toFixed(2)}€
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {profile.role === 'president' && (
                <Card className="bg-white/5 border-white/10 backdrop-blur-md text-white">
                    <CardHeader>
                        <CardTitle className="text-lg">Gestió de Socis</CardTitle>
                        <CardDescription className="text-gray-400">Gestiona els rols i permisos dels membres</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {allProfiles.map((user: any) => (
                                <li key={user.id} className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                                        <Avatar className="h-10 w-10 border border-white/10">
                                            <AvatarFallback className="bg-gray-800 text-gray-300">{user.full_name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm text-white">{user.full_name} <span className="text-purple-400 text-xs">(@{user.nickname})</span></p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="mr-2 bg-white/10 text-gray-300 pointer-events-none">{user.role}</Badge>
                                        {user.id !== profile.id && (
                                            <div className="flex gap-1">
                                                <form action={updateRole.bind(null, user.id, 'treasurer')}>
                                                    <Button size="icon" variant="outline" className="h-8 w-8 bg-transparent border-white/20 text-gray-400 hover:text-white hover:border-white hover:bg-white/10" title="Fer Tresorer">
                                                        <span className="text-xs">T</span>
                                                    </Button>
                                                </form>
                                                <form action={updateRole.bind(null, user.id, 'president')}>
                                                    <Button size="icon" variant="destructive" className="h-8 w-8 bg-red-900/20 border-red-500/30 text-red-400 hover:bg-red-900/40" title="Fer President (Transferir Poder)">
                                                        <span className="text-xs">P</span>
                                                    </Button>
                                                </form>
                                                <form action={updateRole.bind(null, user.id, 'member')}>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-white hover:bg-white/10" title="Degradar a Soci">
                                                        <span className="text-xs">M</span>
                                                    </Button>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
