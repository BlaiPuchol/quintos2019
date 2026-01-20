
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
                <Card>
                    <CardContent className="p-6 text-center">
                        <p>Only the President can access the Warning Management System.</p>
                        <br />
                        <p className="text-sm text-gray-500">Check your Dashboard for your own status.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const supabase = await createClient()
    const { data: users } = await supabase.from('profiles').select('*').order('full_name')

    return (
        <div className="pt-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Posar un llimó (Avisos)</CardTitle>
                    <CardDescription>Els avisos caduquen automàticament als 30 dies.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={createWarning} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Soci / Membre</Label>
                            <select name="target_user_id" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                {users?.map((u: any) => (
                                    <option key={u.id} value={u.id}>{u.full_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label>Motiu</Label>
                            <Input name="reason" placeholder="Ex: Deixar plats bruts, fer soroll..." required />
                        </div>

                        <Button type="submit" variant="destructive" className="w-full">Posar Llimó</Button>
                    </form>
                </CardContent>
            </Card>

            {/* List of recent warnings could go here */}
        </div>
    )
}
