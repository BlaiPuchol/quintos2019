
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Wallet, Vote, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
    const pathname = usePathname()

    const links = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/treasury', label: 'Money', icon: Wallet },
        { href: '/votes', label: 'Vote', icon: Vote },
        { href: '/profile', label: 'Profile', icon: User },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 border-t bg-background p-2 z-50">
            <div className="flex justify-around items-center max-w-md mx-auto">
                {links.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full p-2 rounded-lg transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon size={24} />
                            <span className="text-[10px] mt-1 font-medium">{label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
