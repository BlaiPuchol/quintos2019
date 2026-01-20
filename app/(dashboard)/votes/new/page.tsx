
import { getUserProfile } from '@/lib/data/user'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createPoll } from '../actions'
import { redirect } from 'next/navigation'

export default async function NewVotePage() {
    const profile = await getUserProfile()
    if (profile?.role !== 'president') {
        redirect('/votes')
    }

    return (
        <div className="pt-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-md text-white">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Nova Votació</CardTitle>
                    <CardDescription className="text-gray-400">Crea una enquesta per al grup.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={createPoll} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-gray-300">Títol</Label>
                            <Input name="title" required placeholder="Ex: Comprar un Sofà nou" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-300">Descripció</Label>
                            <Input name="description" placeholder="Detalls..." className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                        </div>

                        <div className="flex items-center space-x-2 py-2">
                            <div className="relative flex items-center">
                                <input type="checkbox" name="is_anonymous" id="anon" className="peer h-5 w-5 appearance-none rounded border border-white/20 bg-white/5 checked:bg-purple-600 checked:border-purple-600 focus:ring-2 focus:ring-purple-500/50" />
                                <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 text-white h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <Label htmlFor="anon" className="text-gray-300 cursor-pointer select-none">Votació Anònima?</Label>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-300">Opcions (separades per comes)</Label>
                            <Input name="options" required placeholder="Sí, No, Potser" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                        </div>

                        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold border-0">Crear Votació</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
