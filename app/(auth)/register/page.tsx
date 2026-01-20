
import { signup } from './actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    const params = await searchParams
    return (
        <div className="flex items-center justify-center min-h-screen bg-black p-4">
            {/* Background Gradients (matching home) */}
            <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[100px]" />

            <Card className="w-full max-w-md z-10 border-white/10 bg-black/50 backdrop-blur-md text-white">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Registrar-se</CardTitle>
                    <CardDescription className="text-center text-gray-400">Crea el teu compte de Quintos</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={signup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name" className="text-gray-200">Nom i Cognoms</Label>
                            <Input id="full_name" name="full_name" type="text" placeholder="Ex: Vicent Giner" required className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nickname" className="text-gray-200">Sobrenom (per a entrar)</Label>
                            <Input id="nickname" name="nickname" type="text" placeholder="Ex: Visantet" required className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-200">Correu electrònic (per recuperar)</Label>
                            <Input id="email" name="email" type="email" placeholder="correu@exemple.com" required className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-200">Contrasenya</Label>
                            <Input id="password" name="password" type="password" required className="bg-white/5 border-white/10 text-white" />
                        </div>
                        {params.error && (
                            <p className="text-sm text-red-400 text-center">{params.error}</p>
                        )}
                        <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">Crear Compte</Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-gray-400">
                        Ja tens compte?{' '}
                        <Link href="/login" className="text-white hover:underline">
                            Entrar
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
