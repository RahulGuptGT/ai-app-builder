import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600" />
              <span className="text-lg font-bold">AI App Builder</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Build Apps with
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Natural Language
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Describe what you want to build. Our AI generates production-ready React code,
            gives you a live preview, and deploys with a single click.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-indigo-600 px-8 py-3 text-base font-medium text-white shadow-lg hover:bg-indigo-700"
            >
              Start Building Free
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-gray-300 px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "AI-Powered", desc: "Sarvam AI generates clean, modern React + TypeScript code from your description." },
              { title: "Live Preview", desc: "See your app rendered instantly with Sandpack — no setup required." },
              { title: "Code Editor", desc: "Edit generated code with Monaco editor and auto-save to Supabase." },
              { title: "One-Click Deploy", desc: "Deploy your app as static HTML to Supabase Storage with a single click." },
              { title: "Template Gallery", desc: "Start from ready-made templates like blank React, landing page, or todo app." },
              { title: "Secure by Default", desc: "Row Level Security on all database tables — your data stays yours." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-20 text-center text-white">
        <h2 className="text-3xl font-bold">Ready to start?</h2>
        <p className="mt-4 text-gray-400">Get 50 free AI credits when you sign up.</p>
        <Link
          href="/signup"
          className="mt-8 inline-block rounded-xl bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100"
        >
          Create Free Account
        </Link>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>AI App Builder — Built with Next.js, Sarvam AI, Supabase, Sandpack</p>
      </footer>
    </div>
  );
}
