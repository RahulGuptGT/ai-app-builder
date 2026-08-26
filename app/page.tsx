import Link from "next/link";
import { Sparkles, Github } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-indigo-600" />
          <span className="text-lg font-bold">AppBuilder</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-gray-50 px-4 py-1.5 text-sm text-gray-600">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          Powered by Sarvam AI
        </div>
        <h1 className="mt-8 max-w-3xl text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
          Build apps with{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            natural language
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-gray-600">
          Describe what you want. AI generates the code. See a live preview
          instantly. Deploy with one click. All powered by Sarvam AI and
          Supabase.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-indigo-600 px-8 py-3 text-white hover:bg-indigo-700"
          >
            Start Building Free
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border px-6 py-3 text-gray-700 hover:bg-gray-50"
          >
            <Github className="h-5 w-5" />
            GitHub
          </a>
        </div>

      {/* Feature grid */}
      <div className="mt-20 grid max-w-4xl gap-8 md:grid-cols-3">
        <div className="text-left">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
            <Sparkles className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="font-semibold">AI Code Generation</h3>
          <p className="mt-1 text-sm text-gray-600">
            Describe your app in Hindi or English. Get production-ready React
            code.
          </p>
        </div>
        <div className="text-left">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <Sparkles className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="font-semibld">Live Preview</h3>
          <p className="mt-1 text-sm text-gray-600">
            See your app render instantly as the AI writes code. No refresh
            needed.
          </p>
        </div>
        <div className="text-left">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <Sparkles className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="font-semibold">One-Click Deploy</h3>
          <p className="mt-1 text-sm text-gray-600">
            Ship your app to a public URL with a single click. Share it
            instantly.
          </p>
        </div>
      </div>
      </section>
    </main>
  );
}
