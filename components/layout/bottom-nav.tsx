
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Wallet, Vote, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
    const pathname = usePathname()

    // Add Warnings as a main link or stick to 4? User mentioned warnings page. 
    // Warnings is usually accessed from Home, but a dedicated tab is nice properly?
    // Let's stick to these 4 for now but localize labels.
    const links = [
        { href: '/dashboard', label: 'Inici', icon: Home },
        { href: '/treasury', label: 'Tresoreria', icon: Wallet },
        { href: '/votes', label: 'Votacions', icon: Vote },
        { href: '/profile', label: 'Perfil', icon: User },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/80 backdrop-blur-lg p-2 z-50 safe-area-bottom">
            <div className="flex justify-around items-center max-w-md mx-auto">
                {links.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full p-2 rounded-xl transition-all duration-300",
                                isActive
                                    ? "text-purple-400 bg-white/10 shadow-[0_0_15px_rgba(168,85,247,0.3)] transform scale-105"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] mt-1 font-medium tracking-wide">{label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
