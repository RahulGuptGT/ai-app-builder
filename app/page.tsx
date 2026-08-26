import Link from "next/link";
import { Sparkles, Github, ArrowRight, Zap, Eye, Rocket, Code2, Palette, Globe } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0f] text-white grid-bg">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-purple-600/8 blur-[100px]" />
        <div className="absolute left-0 bottom-0 h-[300px] w-[300px] rounded-full bg-pink-600/5 blur-[80px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-12">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">AppBuilder</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-gray-400 transition hover:text-white"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="group flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-sm font-medium text-black transition hover:bg-gray-200"
          >
            Get Started
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-16 pb-24 text-center lg:pt-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-gray-400 backdrop-blur">
          <span className="flex h-1.5 w-1.5 rounded-full bg-green-400" />
          Powered by Sarvam AI
          <span className="text-gray-600">•</span>
          Free to start
        </div>

        <h1 className="max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
          Build apps with
          <br />
          <span className="gradient-text">natural language</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-gray-400 md:text-xl">
          Describe what you want. AI writes the code.
          <br className="hidden sm:block" />
          See live preview instantly. Deploy in one click.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:shadow-indigo-500/40 hover:brightness-110"
          >
            Start Building Free
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <a
            href="https://github.com/RahulGuptGT/ai-app-builder"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-base font-medium text-gray-300 backdrop-blur transition hover:bg-white/10 hover:text-white"
          >
            <Github className="h-5 w-5" />
            View Source
          </a>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-400" />
            Real-time generation
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-purple-400" />
            Live preview
          </div>
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-pink-400" />
            One-click deploy
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<Code2 className="h-5 w-5" />}
            title="AI Code Generation"
            desc="Describe your app in Hindi or English. Get production-ready React + TypeScript code instantly."
            gradient="from-indigo-500/20 to-blue-500/5"
            iconColor="text-indigo-400"
          />
          <FeatureCard
            icon={<Eye className="h-5 w-5" />}
            title="Live Preview"
            desc="See your app render in real-time as the AI writes code. No refresh needed. Sandpack-powered."
            gradient="from-purple-500/20 to-pink-500/5"
            iconColor="text-purple-400"
          />
          <FeatureCard
            icon={<Rocket className="h-5 w-5" />}
            title="Instant Deploy"
            desc="Ship your app to a public URL with a single click. Share it with the world instantly."
            gradient="from-pink-500/20 to-orange-500/5"
            iconColor="text-pink-400"
          />
        </div>

        {/* Secondary features */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="gradient-border overflow-hidden p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                <Palette className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold">Smart Templates</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Start from pre-built templates — React starter, landing page,
                  todo app, dashboard, and more. Or build from scratch.
                </p>
              </div>
            </div>
          </div>
          <div className="gradient-border overflow-hidden p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                <Globe className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold">Powered by Sarvam AI</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Built on Sarvam AI's powerful language models. Understands
                  both Hindi and English. Made in India, for the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8 text-center">
        <p className="text-sm text-gray-600">
          Built with Sarvam AI + Supabase + Next.js • Deployed on Vercel
        </p>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  gradient,
  iconColor,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  gradient: string;
  iconColor: string;
}) {
  return (
    <div className={`gradient-border overflow-hidden p-6 transition hover:border-indigo-500/30`}>
      <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${gradient}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <h3 className="mb-1.5 font-semibold">{title}</h3>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
}
