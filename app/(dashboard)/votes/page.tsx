
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getUserProfile } from '@/lib/data/user'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function VotesPage() {
    const profile = await getUserProfile()
    const supabase = await createClient()

    const { data: votes } = await supabase
        .from('votes')
        .select('*, vote_options(*), cast_votes(count)') // cast_votes count specific logic needed?
        .order('created_at', { ascending: false })

    // Note: Supabase count aggregation in join is tricky with standard client. 
    // We can just fetch votes and handle details in detail page.
    // Or fetch votes and options.

    return (
        <div className="pt-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Votacions</h1>
                    <p className="text-sm text-gray-500">Enquestes i decisions actives.</p>
                </div>
                {profile?.role === 'president' && (
                    <Link href="/votes/new">
                        <Button size="sm"><Plus size={16} className="mr-1" /> Nova Votació</Button>
                    </Link>
                )}
            </div>

            <div className="space-y-4">
                {votes?.map((vote: any) => (
                    <Link href={`/votes/${vote.id}`} key={vote.id}>
                        <Card className="hover:bg-gray-50 transition-colors">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between">
                                    <CardTitle className="text-lg">{vote.title}</CardTitle>
                                    {vote.status === 'open' ? <Badge>Oberta</Badge> : <Badge variant="secondary">Tancada</Badge>}
                                </div>
                                <CardDescription>{vote.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-gray-500">
                                    {vote.is_anonymous ? 'Votació Anònima' : 'Votació Pública'} • {new Date(vote.created_at).toLocaleDateString()}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                {votes?.length === 0 && <p className="text-center text-gray-500">No hi ha votacions actives.</p>}
            </div>
        </div>
    )
}
