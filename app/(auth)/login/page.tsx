
import { login } from './actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    const params = await searchParams
    return (
        <div className="flex items-center justify-center min-h-screen bg-black p-4 text-white">
            {/* Background Gradients (matching home) */}
            <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[100px]" />

            <Card className="w-full max-w-md z-10 border-white/10 bg-black/50 backdrop-blur-md text-white">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">App dels Quintos</CardTitle>
                    <CardDescription className="text-center text-gray-400">Inicieu sessió per gestionar el casal</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={login} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nickname" className="text-gray-200">Sobrenom</Label>
                            <Input id="nickname" name="nickname" type="text" placeholder="El teu sobrenom" required className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-200">Contrasenya</Label>
                            <Input id="password" name="password" type="password" required className="bg-white/5 border-white/10 text-white" />
                        </div>
                        {params.error && (
                            <p className="text-sm text-red-400 text-center">{params.error}</p>
                        )}
                        <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">Entrar</Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center flex-col gap-2">
                    <p className="text-sm text-gray-400">
                        No tens compte?{' '}
                        <Link href="/register" className="text-white hover:underline">
                            Registrar-se
                        </Link>
                    </p>
                    <p className="text-xs text-gray-500">Contacteu amb el President si teniu problemes.</p>
                </CardFooter>
            </Card>
        </div>
    )
}
