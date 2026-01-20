
import { BottomNav } from '@/components/layout/bottom-nav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background Gradients (Global for Dashboard) */}
            <div className="fixed top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none z-0" />
            <div className="fixed bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none z-0" />

            <main className="flex-1 pb-24 relative z-10 p-4">
                {children}
            </main>
            <BottomNav />
        </div>
    )
}
