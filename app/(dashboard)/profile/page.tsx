
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
                <h1 className="text-3xl font-bold">El teu Perfil</h1>
                <form action={signOut}>
                    <Button variant="destructive" size="sm">Tancar Sessió</Button>
                </form>
            </div>

            <Card>
                <CardHeader className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={profile.avatar_url || ''} />
                        <AvatarFallback>{profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <CardTitle>{profile.full_name}</CardTitle>
                    <div className="mt-2">
                        <Badge variant="outline">{profile.role === 'president' ? 'President' : profile.role === 'treasurer' ? 'Tresorer' : 'Soci'}</Badge>
                    </div>
                    <CardDescription>{profile.nickname ? `@${profile.nickname}` : profile.email}</CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Dades Personals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label>Nom</Label>
                            <div className="font-medium p-2 bg-gray-50 rounded border">{profile.full_name || 'Desconegut'}</div>
                        </div>
                        <div className="space-y-1">
                            <Label>Email</Label>
                            <div className="font-medium p-2 bg-gray-50 rounded border">{profile.email}</div>
                        </div>
                        <div className="space-y-1">
                            <Label>Sobrenom</Label>
                            <div className="font-medium p-2 bg-gray-50 rounded border">{profile.nickname || '-'}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Situació Financera</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <Label>Saldo Actual</Label>
                            <div className={`text-2xl font-bold ${profile.current_balance < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                {profile.current_balance.toFixed(2)}€
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {profile.role === 'president' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Gestió de Socis</CardTitle>
                        <CardDescription>Gestiona els rols i permisos dels membres</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {allProfiles.map((user: any) => (
                                <li key={user.id} className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{user.full_name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">{user.full_name} <span className="text-gray-400 text-xs">(@{user.nickname})</span></p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="mr-2">{user.role}</Badge>
                                        {user.id !== profile.id && (
                                            <div className="flex gap-1">
                                                <form action={updateRole.bind(null, user.id, 'treasurer')}>
                                                    <Button size="icon" variant="outline" className="h-7 w-7" title="Fer Tresorer">
                                                        <span className="text-xs">T</span>
                                                    </Button>
                                                </form>
                                                <form action={updateRole.bind(null, user.id, 'president')}>
                                                    <Button size="icon" variant="destructive" className="h-7 w-7" title="Fer President (Transferir Poder)">
                                                        <span className="text-xs">P</span>
                                                    </Button>
                                                </form>
                                                <form action={updateRole.bind(null, user.id, 'member')}>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7" title="Degradar a Soci">
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
