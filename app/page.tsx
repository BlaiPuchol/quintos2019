import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/30 blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/30 blur-[100px]" />

      <div className="z-10 flex flex-col items-center text-center gap-8 p-4">
        {/* Hero Title */}
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Quintos 2019
        </h1>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8">
          <Link
            href="/login"
            className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] text-lg"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white font-semibold hover:bg-white/10 transition-all text-lg"
          >
            Registrar-se
          </Link>
        </div>
      </div>
    </main>
  );
}
