
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
                    <h1 className="text-2xl font-bold text-white">Votacions</h1>
                    <p className="text-sm text-gray-400">Enquestes i decisions actives.</p>
                </div>
                {profile?.role === 'president' && (
                    <Link href="/votes/new">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white border-0"><Plus size={16} className="mr-1" /> Nova Votació</Button>
                    </Link>
                )}
            </div>

            <div className="space-y-4">
                {votes?.map((vote: any) => (
                    <Link href={`/votes/${vote.id}`} key={vote.id}>
                        <Card className="bg-white/5 border-white/10 backdrop-blur-md text-white hover:bg-white/10 transition-colors">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg font-bold">{vote.title}</CardTitle>
                                    {vote.status === 'open' ? (
                                        <Badge className="bg-green-500 hover:bg-green-600 text-white">Oberta</Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-gray-700 text-gray-300">Tancada</Badge>
                                    )}
                                </div>
                                <CardDescription className="text-gray-400">{vote.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${vote.is_anonymous ? 'bg-purple-900/40 text-purple-300' : 'bg-blue-900/40 text-blue-300'}`}>
                                        {vote.is_anonymous ? 'ANÒNIMA' : 'PÚBLICA'}
                                    </span>
                                    <span>• {new Date(vote.created_at).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                {votes?.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                        <p className="text-gray-400">No hi ha votacions actives.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
